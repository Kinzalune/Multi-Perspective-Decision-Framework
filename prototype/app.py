from flask import Flask, jsonify, request, render_template
import pandas as pd
import math
from pathlib import Path

app = Flask(__name__)

# --------------------------------------------------
# Configuration
# --------------------------------------------------

DATASET_PATH = Path(__file__).with_name("dataset.csv")

CRITERIA = [
    "cost",
    "benefit",
    "feasibility",
    "risk",
    "stakeholder_impact",
    "sustainability"
]

# Default weights: total = 100%
DEFAULT_WEIGHTS = {
    "cost": 0.20,
    "benefit": 0.25,
    "feasibility": 0.15,
    "risk": 0.15,
    "stakeholder_impact": 0.15,
    "sustainability": 0.10
}

# "min": lower original rating is better.
# "max": higher original rating is better.
#
# Assumption: higher cost/risk ratings mean worse outcomes.
# Stakeholder impact assumes higher ratings mean more positive impact.
CRITERION_DIRECTIONS = {
    "cost": "min",
    "benefit": "max",
    "feasibility": "max",
    "risk": "min",
    "stakeholder_impact": "max",
    "sustainability": "max"
}


# --------------------------------------------------
# Dataset loading and validation
# --------------------------------------------------

def load_dataset():
    df = pd.read_csv(DATASET_PATH)

    required_columns = ["alternative"] + CRITERIA

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            "Dataset is missing required columns: "
            + ", ".join(missing_columns)
        )

    if df.empty:
        raise ValueError("Dataset is empty.")

    # Validate alternative names.
    if (
        df["alternative"].isna().any()
        or df["alternative"].astype(str).str.strip().eq("").any()
    ):
        raise ValueError("Alternative names cannot be empty.")

    # Validate all criterion ratings.
    for criterion in CRITERIA:
        df[criterion] = pd.to_numeric(
            df[criterion],
            errors="raise"
        )

        if df[criterion].isna().any():
            raise ValueError(
                f"Missing ratings in '{criterion}'."
            )

        if not df[criterion].between(1, 5).all():
            raise ValueError(
                f"Ratings in '{criterion}' must be between 1 and 5."
            )

    return df


# --------------------------------------------------
# Weight validation and normalization
# --------------------------------------------------

def validate_weights(weights):
    if not isinstance(weights, dict):
        raise ValueError("Weights must be a JSON object.")

    if set(weights.keys()) != set(CRITERIA):
        raise ValueError(
            "Provide weights for exactly these criteria: "
            + ", ".join(CRITERIA)
        )

    validated = {}

    for criterion in CRITERIA:
        value = weights[criterion]

        # Reject booleans, strings, NaN, infinity, and negative weights.
        if isinstance(value, bool) or not isinstance(
            value, (int, float)
        ):
            raise ValueError(
                f"Weight for '{criterion}' must be numeric."
            )

        if not math.isfinite(value) or value < 0:
            raise ValueError(
                f"Weight for '{criterion}' must be finite "
                "and non-negative."
            )

        validated[criterion] = float(value)

    total = sum(validated.values())

    if not math.isfinite(total) or total <= 0:
        raise ValueError(
            "The sum of weights must be greater than zero."
        )

    # Normalize so all weights sum to 1.
    return {
        criterion: value / total
        for criterion, value in validated.items()
    }


# --------------------------------------------------
# Direction-aware weighted scoring and ranking
# --------------------------------------------------

def calculate_rankings(df, weights):
    df = df.copy()

    # Copy the ratings before applying transformations.
    scoring_df = df[CRITERIA].astype(float).copy()

    for criterion, direction in CRITERION_DIRECTIONS.items():

        if direction == "min":
            # Ratings are validated to be between 1 and 5.
            # Reverse the scale so lower original ratings
            # produce higher adjusted scores.
            scoring_df[criterion] = (
                6 - scoring_df[criterion]
            )

        elif direction != "max":
            raise ValueError(
                f"Invalid scoring direction for '{criterion}'."
            )

    # Calculate the weighted score.
    df["score"] = sum(
        scoring_df[criterion] * weights[criterion]
        for criterion in CRITERIA
    )

    # Highest score ranks first.
    # Stable sorting preserves dataset order for exact ties.
    df = df.sort_values(
        by="score",
        ascending=False,
        kind="mergesort"
    ).reset_index(drop=True)

    # Sequential ranks: ties retain their dataset ordering.
    df["rank"] = df.index + 1

    return df


# --------------------------------------------------
# Home page: interactive web interface
# --------------------------------------------------

@app.route("/")
def home():
    return render_template("index.html")


# --------------------------------------------------
# API health check
# --------------------------------------------------

@app.route("/api/health")
def health():
    return jsonify({
        "status": "OK"
    })


# --------------------------------------------------
# API: retrieve alternatives
# --------------------------------------------------

@app.route("/api/alternatives")
def get_alternatives():
    try:
        df = load_dataset()

        return jsonify({
            "count": len(df),
            "alternatives": df.to_dict(orient="records")
        })

    except (
        ValueError,
        FileNotFoundError,
        pd.errors.ParserError
    ) as error:
        return jsonify({
            "error": str(error)
        }), 400


# --------------------------------------------------
# API: rank alternatives
#
# GET  /api/rank       -> default weights
# POST /api/rank       -> custom weights
# --------------------------------------------------

@app.route("/api/rank", methods=["GET", "POST"])
def rank_alternatives():
    try:
        df = load_dataset()

        if request.method == "POST":
            data = request.get_json(silent=True)

            if not isinstance(data, dict):
                return jsonify({
                    "error": (
                        "Send a JSON request body containing "
                        "a 'weights' object."
                    )
                }), 400

            if "weights" not in data:
                return jsonify({
                    "error": "Missing required field: weights."
                }), 400

            weights = validate_weights(data["weights"])

        else:
            weights = DEFAULT_WEIGHTS.copy()

        ranked_df = calculate_rankings(df, weights)

        # Keep the existing response fields so the
        # interactive frontend continues to work.
        return jsonify({
            "ranking": ranked_df[
                ["rank", "alternative", "score"]
            ].round(2).to_dict(orient="records"),

            "weights": {
                criterion: round(weight, 6)
                for criterion, weight in weights.items()
            },

            "directions": CRITERION_DIRECTIONS
        }), 200

    except (
        ValueError,
        FileNotFoundError,
        pd.errors.ParserError,
        OverflowError
    ) as error:
        return jsonify({
            "error": str(error)
        }), 400


# --------------------------------------------------
# Start Flask development server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )
