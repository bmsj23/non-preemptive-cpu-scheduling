let numProcesses = 0;
let processes = [];
let selectedAlgorithm = 'fcfs';

function setupProcesses() {
    const numInput = document.getElementById("numProcesses");
    const algorithmSelect = document.getElementById("algorithm");
    const num = parseInt(numInput.value);

    // input validation
    if (!num || num < 3 || num > 10) {
        showError("numProcesses", "numProcessesError");
        return;
    }

    clearError("numProcesses", "numProcessesError");
    numProcesses = num;
    selectedAlgorithm = algorithmSelect.value;

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

    // check for duplicate Arrival Times
    const arrivalTimes = [];

    for (let i = 1; i <= numProcesses; i++) {
        const at = document.getElementById(`at${i}`).value;
        const atValue = parseInt(at);
        if (at && !isNaN(atValue) && arrivalTimes.includes(atValue)) {
            showError(`at${i}`, `at${i}Error`);
            document.getElementById(`at${i}Error`).textContent =
                "Arrival Time must be unique";
            allValid = false;
        }
        if (at && !isNaN(atValue)) arrivalTimes.push(atValue);
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

    // calculate scheduling based on selected algorithm
    if (selectedAlgorithm === 'fcfs') {
        calculateFCFS();
    } else if (selectedAlgorithm === 'sjf') {
        calculateSJF();
    }

    // display results
    displayResults();
}

// FCFS (First Come First Serve) scheduling algorithm
function calculateFCFS() {
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
}

// SJF (Shortest Job First) scheduling algorithm
function calculateSJF() {
    // create arrays to track which processes are completed
    let completed = new Array(processes.length).fill(false);
    let currentTime = 0;
    let completedCount = 0;

    // continue until all processes are completed
    while (completedCount < processes.length) {
        let shortestIndex = -1;
        let shortestBurstTime = Infinity;

        // find the process with shortest burst time among available processes
        for (let i = 0; i < processes.length; i++) {
            // check if process has arrived and is not completed
            if (!completed[i] && processes[i].at <= currentTime) {
                // if this process has shorter burst time, select it
                if (processes[i].bt < shortestBurstTime) {
                    shortestBurstTime = processes[i].bt;
                    shortestIndex = i;
                }
            }
        }

        // if no process is available, find the next arrival time
        if (shortestIndex === -1) {
            let nextArrivalTime = Infinity;
            for (let i = 0; i < processes.length; i++) {
                if (!completed[i] && processes[i].at < nextArrivalTime) {
                    nextArrivalTime = processes[i].at;
                }
            }
            currentTime = nextArrivalTime;
            continue; // go back to find available process
        }

        // execute the selected process
        processes[shortestIndex].ct = currentTime + processes[shortestIndex].bt;
        currentTime = processes[shortestIndex].ct;

        // calculate turnaround time and waiting time
        processes[shortestIndex].tat = processes[shortestIndex].ct - processes[shortestIndex].at;
        processes[shortestIndex].wt = processes[shortestIndex].tat - processes[shortestIndex].bt;

        // mark process as completed
        completed[shortestIndex] = true;
        completedCount++;
    }
}


// function to display results
function displayResults() {
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";

    // update algorithm display
    const algorithmUsed = document.getElementById("algorithmUsed");
    algorithmUsed.textContent = selectedAlgorithm === 'fcfs' ? 'First Come First Serve (FCFS)' : 'Shortest Job First (SJF)';

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