import React from 'react';
import './App.css';



class App extends React.Component {

    constructor(props) {
        super(props)
        // Sets the variables that each front-end instance will have
        this.state = {dataset_name: '', dataset_id: '', selectedFiles: null}

        // Connects functions to the front end
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
    }

    // Will update the "name" value with whatever value has been inserted in "name"
    handleChange = ({target}) => {
        this.setState({[target.name]: target.value})
    }
    // Adds a file to the array of files in selectedFiles
    handleFileChange = event => {
        this.setState({
            selectedFiles: event.target.files,
        })

    }

    handleSubmit = (event) => {
        // Prevents a change in URL
        event.preventDefault()
        let fileData = new FormData()
        // Loops to insert the file and filename of each file in selectedFiles into FormData()
        for (let i = 1; i < this.state.selectedFiles.length + 1; i++){
          fileData.append('file' + i.toString(),this.state.selectedFiles[i-1])
          fileData.append('filename' + i.toString(), this.state.selectedFiles[i-1].name)
        }
        // Creates a dictionary and places the necessary values in it
        let obj = {}
        obj.dataset_name = this.state.dataset_name
        obj.dataset_id = this.state.dataset_id
        // Uses a POST request to send obj as a JSON string
        fetch(
            "http://localhost:5000/data", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            // Takes fetch's response as a json
            .then(response => response.json())
            // If it completes, returns success
            .then(obj => {
                console.log('Success:', obj)
            })
            // Displays an error if it runs into one
            .catch((error) => {
                console.error('Error:', error)
            })
        // Uses a POST request to send the FormData
        fetch(
            "http://localhost:5000/files", {
                method: 'POST',
                body: fileData,
            })
            .then(response => response)
            .then(fileData => {
                console.log('Success:', fileData)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }

    render() {
        return (

            <div>
                <form onSubmit={this.handleSubmit} className="parent">
                    <label className="custom_text_placement">
                        Enter the DataSet Name
                        <input type="text"
                               name="dataset_name"
                               onChange={this.handleChange}
                               className="custom_box"
                               required
                        />
                    </label>
                    <label className="custom_text_placement">
                        Enter the DataSet ID
                        <input type="number"
                               name="dataset_id"
                               onChange={this.handleChange}
                               className="custom_box"
                               required
                        />
                    </label>
                    <label>
                        Please select up to 4 files:
                        <input type="file"
                               className="custom_upload"
                               onChange={this.handleFileChange}
                               multiple
                               required
                        />
                    </label>
                    <input type="submit"
                           value="Submit"
                           className="custom_box"
                    />


                </form>
            </div>
        )
    }
}
    export default App