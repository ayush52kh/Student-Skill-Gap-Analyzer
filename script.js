// Each skill has a target rating and a practice suggestion.
const skills = [
    {
        name: "Programming",
        description: "Writing and understanding code",
        suggestion: "Practice one small coding exercise each day."
    },
    {
        name: "Communication",
        description: "Sharing ideas clearly",
        suggestion: "Explain a class topic to a friend or study group."
    },
    {
        name: "Problem Solving",
        description: "Finding steps to solve a problem",
        suggestion: "Break a class problem into smaller steps before solving it."
    },
    {
        name: "Technical Knowledge",
        description: "Understanding your subject and its tools",
        suggestion: "Review one course topic and write a short summary."
    },
    {
        name: "Teamwork",
        description: "Working and learning with other people",
        suggestion: "Take an active role in your next group assignment."
    },
    {
        name: "Time Management",
        description: "Planning and finishing tasks on time",
        suggestion: "Write a short to-do list for your next study day."
    }
];

const targetRating = 4;
const storageName = "studentSkillAssessment";
const learningStorageName = "studentLearningProgress";
const dailyLearningTasks = [
    "Practice a short coding exercise",
    "Explain a topic in your own words",
    "Break a problem into smaller steps",
    "Review a course topic",
    "Learn or study with someone",
    "Plan your study time"
];

let learningProgress = {};

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function getDateFromInput(value) {
    const parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function getTasksForDate(dateString) {
    if (!Array.isArray(learningProgress[dateString])) {
        learningProgress[dateString] = dailyLearningTasks.map(function () {
            return false;
        });
    }

    return dailyLearningTasks.map(function (task, index) {
        return learningProgress[dateString][index] === true;
    });
}

function renderProgressGraph(date) {
    const graph = document.getElementById("progressGraph");
    const dayNumber = date.getDate();
    graph.innerHTML = "";

    for (let day = 1; day <= dayNumber; day++) {
        const dateString = getLocalDateString(
            new Date(date.getFullYear(), date.getMonth(), day)
        );
        const completed = getTasksForDate(dateString).filter(Boolean).length;
        const percentage = (completed / dailyLearningTasks.length) * 100;
        const column = document.createElement("div");
        const barArea = document.createElement("div");
        const bar = document.createElement("div");
        const dayLabel = document.createElement("span");

        column.className = "chart-day";
        barArea.className = "chart-bar-area";
        bar.className = "chart-bar";
        bar.style.height = percentage + "%";
        bar.title = "Day " + day + ": " + completed + " of " +
            dailyLearningTasks.length + " tasks";
        dayLabel.className = "chart-day-label";
        dayLabel.textContent = day;

        barArea.appendChild(bar);
        column.appendChild(barArea);
        column.appendChild(dayLabel);
        graph.appendChild(column);
    }
}

function renderDashboard() {
    const dateInput = document.getElementById("checklistDate");
    const selectedDate = getDateFromInput(dateInput.value);
    const selectedDateString = dateInput.value;
    const selectedTasks = getTasksForDate(selectedDateString);
    const dailyTaskList = document.getElementById("dailyTasks");
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const dayNumber = selectedDate.getDate();
    let monthlyCompleted = 0;
    const completedBySkill = skills.map(function () {
        return 0;
    });

    dailyTaskList.innerHTML = "";

    dailyLearningTasks.forEach(function (task, index) {
        const item = document.createElement("li");
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = selectedTasks[index];
        checkbox.dataset.taskIndex = index;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(task));
        item.appendChild(label);
        dailyTaskList.appendChild(item);
    });

    for (let day = 1; day <= dayNumber; day++) {
        const dateString = getLocalDateString(new Date(selectedYear, selectedMonth, day));
        const completedTasks = getTasksForDate(dateString);

        completedTasks.forEach(function (isComplete, index) {
            if (isComplete) {
                monthlyCompleted++;
                completedBySkill[index]++;
            }
        });
    }

    const monthlyPossible = dayNumber * dailyLearningTasks.length;
    const monthlyPercentage = Math.round((monthlyCompleted / monthlyPossible) * 100);
    document.getElementById("monthlyProgress").textContent = monthlyPercentage + "%";
    document.getElementById("monthlyTaskCount").textContent =
        monthlyCompleted + " of " + monthlyPossible + " tasks completed";

    const weekStart = new Date(selectedYear, selectedMonth, dayNumber);
    const weekday = (weekStart.getDay() + 6) % 7;
    weekStart.setDate(weekStart.getDate() - weekday);
    const weeklyTaskList = document.getElementById("weeklyTasks");
    const completedThisWeek = [];
    let daysInSelectedWeek = 0;

    for (let day = new Date(weekStart); day <= selectedDate; day.setDate(day.getDate() + 1)) {
        daysInSelectedWeek++;
        const dateString = getLocalDateString(day);
        const completedTasks = getTasksForDate(dateString);

        completedTasks.forEach(function (isComplete, index) {
            if (isComplete) {
                completedThisWeek.push(
                    dateString + " - " + dailyLearningTasks[index]
                );
            }
        });
    }

    const weeklyPossible = daysInSelectedWeek * dailyLearningTasks.length;
    const weeklyPercentage = Math.round((completedThisWeek.length / weeklyPossible) * 100);
    document.getElementById("weeklyProgress").textContent = weeklyPercentage + "%";
    document.getElementById("weeklyTaskCount").textContent =
        completedThisWeek.length + " of " + weeklyPossible + " tasks completed";
    weeklyTaskList.innerHTML = "";

    if (completedThisWeek.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No tasks completed yet this week.";
        weeklyTaskList.appendChild(emptyItem);
    } else {
        completedThisWeek.forEach(function (task) {
            const item = document.createElement("li");
            item.textContent = task;
            weeklyTaskList.appendChild(item);
        });
    }

    const skillProgress = document.getElementById("skillProgress");
    skillProgress.innerHTML = "";
    skills.forEach(function (skill, index) {
        const percentage = Math.round((completedBySkill[index] / dayNumber) * 100);
        const row = document.createElement("div");
        row.className = "skill-progress-row";
        const label = document.createElement("span");
        label.textContent = skill.name + " - " + percentage + "%";
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        const progress = document.createElement("div");
        progress.className = "progress";
        progress.style.width = percentage + "%";
        progressBar.appendChild(progress);
        row.appendChild(label);
        row.appendChild(progressBar);
        skillProgress.appendChild(row);
    });

    renderProgressGraph(selectedDate);
}

function loadLearningProgress() {
    const savedProgress = localStorage.getItem(learningStorageName);
    if (savedProgress) {
        try {
            const parsedProgress = JSON.parse(savedProgress);
            if (parsedProgress && typeof parsedProgress === "object" &&
                !Array.isArray(parsedProgress)) {
                learningProgress = parsedProgress;
            } else {
                console.error("Saved learning progress has an unexpected format.");
            }
        } catch (error) {
            console.error("Could not read saved learning progress.", error);
        }
    }
}

// Add five rating choices for each skill.
function showQuestions() {
    const questions = document.getElementById("skillQuestions");

    for (let i = 0; i < skills.length; i++) {
        let question = '<div class="skill-question">';
        question += '<div class="skill-name">' + skills[i].name;
        question += '<span class="skill-description">' + skills[i].description + '</span></div>';
        question += '<div class="rating-options">';

        for (let rating = 1; rating <= 5; rating++) {
            question += '<label><input type="radio" name="skill' + i +
                '" value="' + rating + '" required> ' + rating + '</label>';
        }

        question += '</div></div>';
        questions.innerHTML += question;
    }
}

// Work out whether a skill is strong, average, or needs practice.
function getSkillLevel(rating) {
    if (rating >= 4) {
        return "Strong";
    } else if (rating === 3) {
        return "Average";
    } else {
        return "Needs practice";
    }
}

// Display the assessment and suggest activities for lower-rated skills.
function showResults(assessment) {
    const results = document.getElementById("results");
    const skillResults = document.getElementById("skillResults");
    const recommendations = document.getElementById("recommendations");
    let totalRating = 0;

    skillResults.innerHTML = "";
    recommendations.innerHTML = "";

    for (let i = 0; i < skills.length; i++) {
        const rating = assessment.ratings[i];
        let gap = targetRating - rating;
        if (gap < 0) {
            gap = 0;
        }
        totalRating += rating;

        let skillResult = '<div class="skill-result">';
        skillResult += "<strong>" + skills[i].name + "</strong>";
        skillResult += "<p>Rating: " + rating + "/5 — " + getSkillLevel(rating) + "</p>";
        skillResult += "<p>Gap from target: " + gap + "</p>";
        skillResult += '<div class="progress-bar"><div class="progress" style="width: ' +
            (rating * 20) + '%"></div></div></div>';
        skillResults.innerHTML += skillResult;

        if (rating < targetRating) {
            recommendations.innerHTML += "<li><strong>" + skills[i].name +
                ":</strong> " + skills[i].suggestion + "</li>";
        }
    }

    const average = (totalRating / skills.length).toFixed(1);
    document.getElementById("studentSummary").textContent =
        assessment.name + " · " + assessment.course + " · " + assessment.semester;
    document.getElementById("overallScore").textContent =
        "Average rating: " + average + " out of 5";

    if (recommendations.innerHTML === "") {
        recommendations.innerHTML = "<li>Great work! Keep practicing all your skills.</li>";
    }

    results.hidden = false;
}

// Save the form answers in the browser and display the report.
document.getElementById("assessment").addEventListener("submit", function (event) {
    event.preventDefault();

    const assessment = {
        name: document.getElementById("studentName").value.trim(),
        course: document.getElementById("course").value,
        semester: document.getElementById("semester").value,
        ratings: []
    };

    for (let i = 0; i < skills.length; i++) {
        const selectedRating = document.querySelector('input[name="skill' + i + '"]:checked');
        assessment.ratings.push(Number(selectedRating.value));
    }

    localStorage.setItem(storageName, JSON.stringify(assessment));
    showResults(assessment);
    document.getElementById("results").scrollIntoView();
});

// Add the questions before restoring any saved ratings.
showQuestions();

// Restore and display the learning checklist.
loadLearningProgress();
const checklistDate = document.getElementById("checklistDate");
checklistDate.value = getLocalDateString(new Date());
checklistDate.max = checklistDate.value;
renderDashboard();

checklistDate.addEventListener("change", renderDashboard);
document.getElementById("dailyTasks").addEventListener("change", function (event) {
    const taskIndex = Number(event.target.dataset.taskIndex);
    if (Number.isInteger(taskIndex) && taskIndex >= 0 &&
        taskIndex < dailyLearningTasks.length) {
        const tasks = getTasksForDate(checklistDate.value);
        tasks[taskIndex] = event.target.checked;
        learningProgress[checklistDate.value] = tasks;
        localStorage.setItem(learningStorageName, JSON.stringify(learningProgress));
        renderDashboard();
    }
});

// Restore the last report when the page is opened again.
const savedAssessment = localStorage.getItem(storageName);

if (savedAssessment) {
    const previousAssessment = JSON.parse(savedAssessment);
    document.getElementById("studentName").value = previousAssessment.name;
    document.getElementById("course").value = previousAssessment.course;
    document.getElementById("semester").value = previousAssessment.semester;

    for (let i = 0; i < previousAssessment.ratings.length; i++) {
        const ratingInput = document.querySelector(
            'input[name="skill' + i + '"][value="' + previousAssessment.ratings[i] + '"]'
        );

        if (ratingInput) {
            ratingInput.checked = true;
        }
    }

    showResults(previousAssessment);
}

// Open the browser's print window so the report can be printed or saved as PDF.
document.getElementById("printButton").addEventListener("click", function () {
    window.print();
});

// Clear the saved report and reset the form.
document.getElementById("resetButton").addEventListener("click", function () {
    localStorage.removeItem(storageName);
    document.getElementById("assessment").reset();
    document.getElementById("results").hidden = true;
});
