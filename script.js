let numProcesses = 0;
let processes = [];

function setupProcesses() {
    const numInput = document.getElementById("numProcesses");
    const num = parseInt(numInput.value);

    // input validation
    if (!num || num < 3 || num > 10) {
        showError("numProcesses", "numProcessesError");
        return;
    }

    clearError("numProcesses", "numProcessesError");
    numProcesses = num;

    // create process input forms
    const processInputs = document.getElementById("processInputs");
    processInputs.innerHTML = "";
    processInputs.style.display = "grid";

    for (let i = 1; i <= numProcesses; i++) {
        const processCard = document.createElement("div");
        processCard.className = "process-card";
        processCard.innerHTML = `
        <h4>Process ${i}</h4>
        <div class="form-group">
                <label>Process ID:</label>
                <input type="text" id="pid${i}" placeholder="e.g., P${i}" value="P${i}">
                <div class="error-message" id="pid${i}Error">Process ID is required</div>
        </div>
        <div class="form-group">
                <label>Arrival Time:</label>
                <input type="number" id="at${i}" min="0" placeholder="Enter arrival time" value="0">
                <div class="error-message" id="at${i}Error">Please enter a valid arrival time (≥0)</div>
        </div>
        <div class="form-group">
                <label>Burst Time:</label>
                <input type="number" id="bt${i}" min="1" placeholder="Enter burst time">
                <div class="error-message" id="bt${i}Error">Please enter a valid burst time (>0)</div>
        </div>
        `;
        processInputs.appendChild(processCard);

        // add input listeners for validation
        document.getElementById(`pid${i}`).addEventListener("input", validateInputs);
        document.getElementById(`at${i}`).addEventListener("input", validateInputs);
        document.getElementById(`bt${i}`).addEventListener("input", validateInputs);
    }

    // show the process input step
    document.getElementById("processStep").style.display = "block";

    // validate inputs initially
    validateInputs();
}

function validateInputs() {
    let allValid = true;

    for (let i = 1; i <= numProcesses; i++) {
        const pid = document.getElementById(`pid${i}`).value.trim();
        const at = document.getElementById(`at${i}`).value;
        const bt = document.getElementById(`bt${i}`).value;

        // validate process ID
        if (!pid) {
            showError(`pid${i}`, `pid${i}Error`);
            allValid = false;
        } else {
            clearError(`pid${i}`, `pid${i}Error`);
        }

        // validate arrival time
        if (!at || parseInt(at) < 0) {
            showError(`at${i}`, `at${i}Error`);
            allValid = false;
        } else {
            clearError(`at${i}`, `at${i}Error`);
        }

        // validate burst time
        if (!bt || parseInt(bt) <= 0) {
            showError(`bt${i}`, `bt${i}Error`);
            allValid = false;
        } else {
            clearError(`bt${i}`, `bt${i}Error`);
        }
    }

    // check for duplicate Process IDs
    const pids = [];

    for (let i = 1; i <= numProcesses; i++) {
        const pid = document.getElementById(`pid${i}`).value.trim();
        if (pid && pids.includes(pid)) {
            showError(`pid${i}`, `pid${i}Error`);
            document.getElementById(`pid${i}Error`).textContent =
                "Process ID must be unique";
            allValid = false;
        }
        if (pid) pids.push(pid);
    }

    // enable or disable the calculate button based on validation
    document.getElementById("calculate-button").disabled = !allValid;
}

// function for showing error messages
function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add("error");
    document.getElementById(errorId).style.display = "block";
}

// function for clearing error messages
function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("error");
    document.getElementById(errorId).style.display = "none";
}

// function to calculate CPU scheduling
function calculateScheduling() {
    // array for storing process objects
    processes = [];

    // loop through each process input and create a process object
    for (let i = 1; i <= numProcesses; i++) {
        processes.push({
            pid: document.getElementById(`pid${i}`).value.trim(), // process ID
            at: parseInt(document.getElementById(`at${i}`).value), // arrival time
            bt: parseInt(document.getElementById(`bt${i}`).value), // burst time
            wt: 0, // waiting time
            tat: 0, // turnaround time
            ct: 0, // completion time
        });
    }

    // sort by arrival time for FCFS scheduling
    processes.sort((a, b) => a.at - b.at);

    // calculate completion times
    let currentTime = 0;

    for (let i = 0; i < processes.length; i++) {

        // if current time is less than arrival time, wait
        if (currentTime < processes[i].at) {
            currentTime = processes[i].at;
        }

        // set completion time
        processes[i].ct = currentTime + processes[i].bt;
        
        // update current time
        currentTime = processes[i].ct;
        
        // calculate turnaround time and waiting time
        processes[i].tat = processes[i].ct - processes[i].at;
        processes[i].wt = processes[i].tat - processes[i].bt;  
    }

    // display results
    displayResults();
}


// function to display results
function displayResults() {
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";

    let totalWT = 0,
        totalTAT = 0;

    // loop through each process and create a table row
    processes.forEach((process) => {
        const row = document.createElement("tr");
        row.innerHTML = 
        `<td>${process.pid}</td>
        <td>${process.at}</td>
        <td>${process.bt}</td>
        <td>${process.wt}</td>
        <td>${process.tat}</td>`;
        resultsBody.appendChild(row);

        totalWT += process.wt;
        totalTAT += process.tat;
    });

    // calculate and display averages
    const avgWT = (totalWT / numProcesses).toFixed(1);
    const avgTAT = (totalTAT / numProcesses).toFixed(1);

    document.getElementById("avgWT").textContent = avgWT;
    document.getElementById("avgTAT").textContent = avgTAT;

    document.getElementById("results").style.display = "block";

    // console output for verification
    console.log("PID\tAT\tBT\tWT\tTAT");
    processes.forEach((p) => {
        console.log(`${p.pid}\t${p.at}\t${p.bt}\t${p.wt}\t${p.tat}`);
    });
    console.log(`\nAverage Waiting Time = ${avgWT}`);
    console.log(`Average Turnaround Time = ${avgTAT}`);
}

// function to reset the form and results
function reset() {
    document.getElementById("numProcesses").value = "";
    document.getElementById("processStep").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("processInputs").style.display = "none";
    document.getElementById("numProcesses").value = "5";
    numProcesses = 0;
    processes = [];
}

// initialize with sample data for quick testing
window.addEventListener("load", function () {
    document.getElementById("numProcesses").value = "5";
    
});