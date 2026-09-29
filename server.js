const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static("public"));

let students = [
    {
        id: 1,
        name: "Muralidharan",
        registerNo: "101",
        department: "CSE",
        marks: 85
    },
    {
        id: 2,
        name: "Arun",
        registerNo: "102",
        department: "CSE",
        marks: 72
    }
];

function getResult(marks) {
    return Number(marks) >= 50 ? "PASS" : "FAIL";
}

// GET students
app.get("/api/students", (req, res) => {

    const result = students.map(student => ({
        ...student,
        result: getResult(student.marks)
    }));

    res.json(result);
});

// ADD student
app.post("/api/students", (req, res) => {

    const {
        name,
        registerNo,
        department,
        marks
    } = req.body;

    if (!name || !registerNo || !department || marks === undefined) {

        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const numericMarks = Number(marks);

    if (
        Number.isNaN(numericMarks) ||
        numericMarks < 0 ||
        numericMarks > 100
    ) {

        return res.status(400).json({
            message: "Marks must be between 0 and 100"
        });
    }

    const duplicate = students.some(
        student =>
            student.registerNo.toLowerCase() ===
            String(registerNo).toLowerCase()
    );

    if (duplicate) {

        return res.status(409).json({
            message: "Register number already exists"
        });
    }

    const student = {

        id: Date.now(),

        name: String(name).trim(),

        registerNo: String(registerNo).trim(),

        department: String(department).trim(),

        marks: numericMarks
    };

    students.push(student);

    res.status(201).json({
        ...student,
        result: getResult(student.marks)
    });
});

// DELETE student
app.delete("/api/students/:id", (req, res) => {

    const id = Number(req.params.id);

    const oldLength = students.length;

    students = students.filter(
        student => student.id !== id
    );

    if (students.length === oldLength) {

        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json({
        message: "Student deleted successfully"
    });
});

app.listen(PORT, () => {

    console.log(
        `Student Result System running on port ${PORT}`
    );

});