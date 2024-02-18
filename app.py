from flask import Flask, render_template, request, jsonify
import pickle
import traceback
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    with open('C:\\Users\\hp\\form-validation\\random.pkl', 'rb') as model_file:
        rf = pickle.load(model_file)
except Exception as e:
    traceback.print_exc()


@app.route('/predict', methods=['POST'])
def predict():
    try: 
        test_input = request.json['all']
        print(test_input)
        
        test_df = pd.DataFrame([test_input])
        predictions = rf.predict(test_df)
        print(predictions)
        if predictions == 0:
            return jsonify(result = '0')
        else:
            return jsonify(result = '1')
        
    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Error during prediction.'})

if __name__ == '__main__':
    app.run(debug=True)