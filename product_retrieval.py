import openai
import pandas as pd
import json
import os

openai.api_key = "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"

csv_file = "products.csv"

DEFAULT_THRESHOLD = 0.55

# Step 1: Load CSV data and convert to JSON format
def load_csv_as_json(file_path):
    """
    Reads the CSV file and converts it into a JSON-like structure (list of dictionaries).
    """
    df = pd.read_csv(file_path)
    return df, df.to_dict(orient="records")

# Step 2: Construct prompt dynamically
def construct_prompt(prompt, product):
    """
    Constructs a prompt based on user query and the selected product attributes (Title, Description, Price).
    """
    product_info = f"""
    - Title: {product.get('Title', 'N/A')}
    - Description: {product.get('Description', 'N/A')}
    - Price: {product.get('Price', 'N/A')}
    """
    input_prompt = f"""
    User Query: "{prompt}"
    Product Information:
    {product_info}

    On a scale of 0 to 1, how relevant is this product to the query? Provide only the score.
    """
    return input_prompt

# Step 3: Query OpenAI for relevance score using the new method
def get_relevance_score(prompt, product):
    """
    Sends the prompt to OpenAI to get a relevance score for the product.
    """
    input_prompt = construct_prompt(prompt, product)
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that evaluates product relevance."},
                {"role": "user", "content": input_prompt}
            ]
        )
        score = float(response["choices"][0]["message"]["content"].strip())
        return score
    except Exception as e:
        print(f"Error querying OpenAI: {e}")
        return 0.0

# Step 4: Process products, add scores to DataFrame, and save results
def process_and_save_results(csv_file, query, threshold):
    """
    Processes the products, adds a similarity score column, saves results for the query,
    and saves a readme file containing the query and dataset name.
    """
    # Load the CSV file
    products_df, products_json = load_csv_as_json(csv_file)

    # Generate a unique directory name for this CSV file and query
    csv_filename = os.path.splitext(os.path.basename(csv_file))[0]
    query_safe = query.replace(" ", "_").replace("/", "_")[:50]
    output_folder = f"results/{csv_filename}_{query_safe}"
    os.makedirs(output_folder, exist_ok=True)

    # Process each product and calculate relevance scores
    scores = []
    for product in products_json:
        # Filter only Title, Description, and Price for LLM search
        filtered_product = {
            "Title": product.get("Title", "N/A"),
            "Description": product.get("Description", "N/A"),
            "Price": product.get("Price", "N/A")
        }
        score = get_relevance_score(query, filtered_product)
        scores.append(score)

    # Add scores to DataFrame
    products_df["Relevance Score"] = scores

    # Save the updated DataFrame to a CSV file
    output_file = f"{output_folder}/results.csv"
    products_df.to_csv(output_file, index=False)

    # Save a readme file with the query and dataset name
    readme_file = f"{output_folder}/readme.txt"
    with open(readme_file, "w") as readme:
        readme.write(f"Dataset: {os.path.basename(csv_file)}\n")
        readme.write(f"Query: {query}\n")

    print(f"Results saved to '{output_file}'")
    print(f"Readme file saved to '{readme_file}'")

# Main function for running the framework
if __name__ == "__main__":
    print("Welcome to the Product Retrieval System!")
    csv_file = input("Enter the path to the CSV file: ").strip()
    query = input("Enter your query: ").strip()
    user_threshold = input(f"Enter the relevance threshold (default: {DEFAULT_THRESHOLD}): ").strip()

    threshold = float(user_threshold) if user_threshold else DEFAULT_THRESHOLD

    process_and_save_results(csv_file, query, threshold)


"python product_retrieval.py"
"products.csv"
"I want something in gold"


