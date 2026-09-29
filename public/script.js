const form =
    document.getElementById("studentForm");

const tableBody =
    document.getElementById("studentTableBody");

const searchInput =
    document.getElementById("searchInput");

const message =
    document.getElementById("message");

const studentCount =
    document.getElementById("studentCount");

const emptyState =
    document.getElementById("emptyState");


let students = [];


// GET STUDENTS

async function loadStudents() {

    try {

        const response =
            await fetch("/api/students");

        students =
            await response.json();

        renderStudents();

    } catch (error) {

        showMessage(
            "Unable to load students.",
            "error"
        );

    }
}


// DISPLAY STUDENTS

function renderStudents() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredStudents =
        students.filter(student =>

            student.name
                .toLowerCase()
                .includes(searchText)

            ||

            student.registerNo
                .toLowerCase()
                .includes(searchText)

            ||

            student.department
                .toLowerCase()
                .includes(searchText)
        );


    tableBody.innerHTML = "";


    studentCount.textContent =
        `${filteredStudents.length} student${
            filteredStudents.length === 1
                ? ""
                : "s"
        }`;


    emptyState.style.display =
        filteredStudents.length === 0
            ? "block"
            : "none";


    filteredStudents.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(student.name)}
            </td>

            <td>
                ${escapeHtml(student.registerNo)}
            </td>

            <td>
                ${escapeHtml(student.department)}
            </td>

            <td>
                ${student.marks}
            </td>

            <td>

                <span class="${
                    student.result === "PASS"
                        ? "pass"
                        : "fail"
                }">

                    ${student.result}

                </span>

            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">

                    🗑 Delete

                </button>

            </td>
        `;


        tableBody.appendChild(row);

    });
}


// ADD STUDENT

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const registerNo =
            document
                .getElementById("registerNo")
                .value
                .trim();


        const department =
            document
                .getElementById("department")
                .value;


        const marks =
            document
                .getElementById("marks")
                .value;


        try {

            const response =
                await fetch(
                    "/api/students",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name,

                            registerNo,

                            department,

                            marks

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                showMessage(
                    data.message,
                    "error"
                );

                return;
            }


            showMessage(
                "Student added successfully!",
                "success"
            );


            form.reset();


            await loadStudents();

        } catch (error) {

            showMessage(
                "Server error.",
                "error"
            );

        }

    }
);


// DELETE STUDENT

async function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Delete this student?"
        );


    if (!confirmDelete) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message,
                "error"
            );

            return;
        }


        showMessage(
            "Student deleted successfully!",
            "success"
        );


        await loadStudents();

    } catch (error) {

        showMessage(
            "Unable to delete student.",
            "error"
        );

    }
}


// SEARCH

searchInput.addEventListener(
    "input",
    renderStudents
);


// MESSAGE

function showMessage(
    text,
    type
) {

    message.textContent = text;

    message.className = type;


    setTimeout(() => {

        message.textContent = "";

        message.className = "";

    }, 3000);
}


// SECURITY

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


// START

loadStudents();