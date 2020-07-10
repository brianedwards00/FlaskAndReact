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
        console.log(this.state.selectedFiles)
        for (let i = 1; i < this.state.selectedFiles.length + 1; i++){

        }
        let fileData = new FormData()
        // Loops to insert the file and filename of each file in selectedFiles into FormData()
        for (let i = 1; i < this.state.selectedFiles.length + 1; i++){
            let ext = this.state.selectedFiles[i-1].name.split('.').pop()
                if(ext !== "txt" && ext !== "fasta" && ext !== "raw") {
                    window.alert("You can only upload parameter files[.txt], protein files[.fasta] " +
                    "and mass spectrometer output files[.raw]. Please select the files again")
                    document.getElementById('inputFiles').value = null
                    console.log(this.state.selectedFiles)
                    return
                }

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
        document.getElementById('inputName').value = ''
        document.getElementById('inputId').value = ''
        document.getElementById('inputFiles').value = null
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="parent">
                    <label>
                        <p style={{'fontSize':'20px'}}>Enter the DataSet Name</p>
                        <input type="text"
                               name="dataset_name"
                               id = "inputName"
                               onChange={this.handleChange}
                               className="custom_box"
                               pattern= "[a-zA-Z0-9-_]{1,}"
                               title="A-Z, a-z , 0-9 , _ , -"
                               required
                        />

                        <p style={{'fontSize': '10px'}}>Must only include letters, numbers, underscores ( _ ),
                            and/or hyphens ( - )</p>
                    </label>

                    <label>
                        <p style={{'fontSize':'20px'}}>Enter the DataSet ID</p>
                        <input type="text"
                               name="dataset_id"
                               id = "inputId"
                               onChange={this.handleChange}
                               className="custom_box"
                               pattern="[0-9]{1,}"
                               title="0-9"
                               required
                        />
                        <p style={{'fontSize': '10px'}}>Must only include integers 0-9, no decimal points</p>
                    </label>
                    <label>
                        Please select up to 4 files:
                        <input type="file"
                               className="custom_upload"
                               id = "inputFiles"
                               onChange={this.handleFileChange}
                               multiple
                               required
                               title=".txt .fasta. or .raw"
                        />

                    </label>
                    <input style={{'fontSize':'40px'}}
                           type="submit"
                           value="Submit"
                           className="custom_box"
                    />
                </form>
            </div>
        )
    }
}
    export default App