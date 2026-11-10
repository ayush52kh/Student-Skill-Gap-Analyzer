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
