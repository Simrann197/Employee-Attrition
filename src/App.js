import React, { Component } from "react";
import "./App.css";

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    val === null && (valid = false);
  });

  return valid;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      satisfaction_level: null,
      last_evaluation: null,
      number_project: null,
      average_monthly_hours: null,
      tenure: null,
      work_accident: null,
      promotion_last_5years: null,
      salary: null,
      department: null,
      formErrors: {
        satisfaction_level: "",
        last_evaluation: "",
        number_project: "",
        average_monthly_hours: "",
        tenure: "",
        work_accident: "",
        promotion_last_5years: "",
        salary: "",
        department: "",
      },
      prediction: "", 
      error: "", 
    };
  }
  handleSubmit = async (e) => {
    e.preventDefault();

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        'satisfaction_level': ${this.state.satisfaction_level}
        'last_evaluation': ${this.state.last_evaluation}
        'number_project': ${this.state.number_project}
        'average_monthly_hours': ${this.state.average_monthly_hours}
        'tenure': ${this.state.tenure}
        'work_accident': ${this.state.work_accident}
        'promotion_last_5years': ${this.state.promotion_last_5years}
        'salary': ${this.state.salary}
        'department': ${this.state.department}
      `);
      var salary = 0;
      if (this.state.salary === "Low") {
        salary = 0;
      } else if (this.state.salary === "Medium") {
        salary = 1;
      } else {
        salary = 2;
      }

      var department_IT = 0,
        department_RandD = 0,
        department_accounting = 0,
        department_hr = 0,
        department_management = 0,
        department_marketing = 0,
        department_product_mng = 0,
        department_sales = 0,
        department_support = 0,
        department_technical = 0;
      if (this.state.department === "HR") department_hr = 1;
      else if (this.state.department === "Accounting")
        department_accounting = 1;
      else if (this.state.department === "Management")
        department_management = 1;
      else if (this.state.department === "Marketing") department_marketing = 1;
      else if (this.state.department === "ProductManager")
        department_product_mng = 1;
      else if (this.state.department === "Sales") department_sales = 1;
      else if (this.state.department === "Support") department_support = 1;
      else if (this.state.department === "IT") department_IT = 1;
      else department_technical = 1;
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }

    let promotionValue = null;
    if (this.state.promotion_last_5years === "Yes") {
      promotionValue = 1;
    } else if (this.state.promotion_last_5years === "No") {
      promotionValue = 0;
    } else {
      console.error("Invalid value for promotion_last_5years");
    }
    const satisfactionLevel = parseFloat(this.state.satisfaction_level);
    const lastEvaluation = parseFloat(this.state.last_evaluation);

    let all = {
      satisfaction_level: satisfactionLevel,
      last_evaluation: lastEvaluation,
      number_project: parseInt(this.state.number_project, 10),
      average_monthly_hours: parseInt(this.state.average_monthly_hours, 10),
      tenure: parseInt(this.state.tenure, 10),
      work_accident: parseInt(this.state.work_accident, 10),
      promotion_last_5years: promotionValue,
      salary: salary,
      department_IT: department_IT,
      department_RandD: department_RandD,
      department_accounting: department_accounting,
      department_hr: department_hr,
      department_management: department_management,
      department_marketing: department_marketing,
      department_product_mng: department_product_mng,
      department_sales: department_sales,
      department_support: department_support,
      department_technical: department_technical,
    };

    console.log(all);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ all: all }),
      });

      if (!response.ok) {
        throw new Error("Error predicting stress");
      }

      const result = await response.json();
      console.log(result);
      if (result.result === '0') this.setState({ prediction: "Stay" });
      else this.setState({ prediction: "Leave" });
    } catch (error) {
      console.error(error);
    }
  };

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  render() {
    const { formErrors, prediction, error } = this.state;

    return (
      <div className="wrapper">
        {error && error.message && <p>Error: {error.message}</p>}
        <div className="form-wrapper">
          <h1>Enter Details</h1>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="firstName">
              <label htmlFor="satisfaction">Satisfaction Level</label>
              <input
                placeholder=""
                type="number"
                name="satisfaction_level"
                noValidate
                onChange={this.handleChange}
              />
            </div>
            <div className="firstName">
              <label htmlFor="firstName">Last Evaluation</label>
              <input
                placeholder=""
                type="number"
                name="last_evaluation"
                noValidate
                onChange={this.handleChange}
              />
            </div>
            <div className="firstName">
              <label htmlFor="firstName">Number of Projects</label>
              <input
                placeholder=""
                type="number"
                name="number_project"
                noValidate
                onChange={this.handleChange}
              />
            </div>
            <div className="lastName">
              <label htmlFor="lastName">Average monthly hours</label>
              <input
                placeholder=""
                type="number"
                name="average_monthly_hours"
                noValidate
                onChange={this.handleChange}
              />
            </div>
            <div className="firstName">
              <label htmlFor="firstName">Tenure</label>
              <input
                placeholder=""
                type="number"
                name="tenure"
                noValidate
                onChange={this.handleChange}
              />
            </div>
            <div className="firstName">
              <label htmlFor="firstName">Work Accident</label>
              <input
                placeholder=""
                type="number"
                name="work_accident"
                noValidate
                onChange={this.handleChange}
              />
            </div>
            <div className="firstName">
              <label htmlFor="email">Promotion in last 5 years</label>
              <select
                className={formErrors.department ? "error" : null}
                name="promotion_last_5years"
                onChange={this.handleChange}
              >
                <option value="">Yes / No</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="firstName">
              <label htmlFor="firstName">Salary</label>
              <select
                className={formErrors.department ? "error" : null}
                name="salary"
                onChange={this.handleChange}
              >
                <option value="">Select Salary</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="password">
              <label htmlFor="password">Department</label>
              <select
                className={formErrors.department ? "error" : null}
                name="department"
                onChange={this.handleChange}
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Accounting">Accounting</option>
                <option value="Management">Management</option>
                <option value="Marketing">Marketing</option>
                <option value="ProductManager">Product Manager</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
                <option value="IT">IT</option>
                <option value="Technical">Technical</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="createAccount">
              <button type="submit">Submit</button>
              <small>
                Click submit to predict your probability of attrition
              </small>
            </div>
            {prediction && <p>Prediction: {prediction}</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default App;