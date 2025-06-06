document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById("input-box");
    const listContainer = document.getElementById("list-container");
    const themeSwitch = document.getElementById("theme-switch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const clearCompletedBtn = document.getElementById("clear-completed");
    const taskCountElement = document.getElementById("task-count");
    const timerDisplay = document.getElementById("timer-display");
    const startTimerBtn = document.getElementById("start-timer");
    const resetTimerBtn = document.getElementById("reset-timer");
    const timerButtons = document.querySelectorAll(".timer-btn");
    const pomodoroSessionsElement = document.getElementById("pomodoro-sessions");
    const notification = document.getElementById("notification");
    
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isTimerRunning = false;
    let pomodoroSessions = 0;
    
    // Load saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeSwitch.checked = true;
    }
    
    // Load saved tasks
    showTask();
    updateTaskCount();
    
    // Theme switcher
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        }
    });
    
    // Add task
    function addTask() {
        if (inputBox.value.trim() === "") {
            showNotification("Please enter a task");
            return;
        }
        
        let li = document.createElement('li');
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        
        let span = document.createElement('span');
        span.innerHTML = '<i class="fas fa-trash-alt"></i>';
        li.appendChild(span);
        
        inputBox.value = "";
        saveData();
        updateTaskCount();
        
        // Scroll to the new task
        li.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Handle task clicks
    listContainer.addEventListener("click", function(e) {
        if (e.target.tagName === "LI" || e.target.parentElement.tagName === "LI") {
            const li = e.target.tagName === "LI" ? e.target : e.target.parentElement;
            li.classList.toggle("checked");
            saveData();
            updateTaskCount();
        } else if (e.target.tagName === "SPAN" || e.target.classList.contains("fa-trash-alt")) {
            const li = e.target.tagName === "SPAN" ? e.target.parentElement : e.target.parentElement.parentElement;
            li.classList.add("fade-out");
            setTimeout(() => {
                li.remove();
                saveData();
                updateTaskCount();
            }, 300);
        }
    }, false);
    
    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            const filter = this.getAttribute("data-filter");
            const tasks = listContainer.querySelectorAll("li");
            
            tasks.forEach(task => {
                switch(filter) {
                    case "all":
                        task.style.display = "flex";
                        break;
                    case "active":
                        task.style.display = task.classList.contains("checked") ? "none" : "flex";
                        break;
                    case "completed":
                        task.style.display = task.classList.contains("checked") ? "flex" : "none";
                        break;
                }
            });
        });
    });
    
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', function() {
        const completedTasks = listContainer.querySelectorAll("li.checked");
        if (completedTasks.length === 0) {
            showNotification("No completed tasks to clear");
            return;
        }
        
        completedTasks.forEach(task => {
            task.classList.add("fade-out");
            setTimeout(() => {
                task.remove();
                saveData();
                updateTaskCount();
            }, 300);
        });
        
        showNotification("Cleared completed tasks");
    });
    
    // Update task count
    function updateTaskCount() {
        const totalTasks = listContainer.querySelectorAll("li").length;
        const completedTasks = listContainer.querySelectorAll("li.checked").length;
        const remainingTasks = totalTasks - completedTasks;
        
        taskCountElement.textContent = `${remainingTasks} ${remainingTasks === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Save tasks to localStorage
    function saveData() {
        localStorage.setItem("data", listContainer.innerHTML);
    }
    
    // Load tasks from localStorage
    function showTask() {
        listContainer.innerHTML = localStorage.getItem("data") || "";
    }
    
    // Timer functionality
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        startTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isTimerRunning = false;
                startTimerBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                
                // Play sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
                
                // Show notification
                const timerType = timerDisplay.textContent === "05:00" ? "Short break" : 
                                timerDisplay.textContent === "15:00" ? "Long break" : "Work session";
                showNotification(`${timerType} completed!`);
                
                // Increment pomodoro counter for work sessions
                if (timerType === "Work session") {
                    pomodoroSessions++;
                    pomodoroSessionsElement.textContent = pomodoroSessions;
                    localStorage.setItem("pomodoroSessions", pomodoroSessions);
                }
            }
        }, 1000);
    }
    
    function pauseTimer() {
        clearInterval(timer);
        isTimerRunning = false;
        startTimerBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    }
    
    function resetTimer() {
        pauseTimer();
        updateTimerDisplay();
    }
    
    // Timer controls
    timerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minutes = parseInt(this.getAttribute("data-time"));
            timeLeft = minutes * 60;
            updateTimerDisplay();
            resetTimer();
        });
    });
    
    startTimerBtn.addEventListener('click', function() {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Load pomodoro sessions
    if (localStorage.getItem("pomodoroSessions")) {
        pomodoroSessions = parseInt(localStorage.getItem("pomodoroSessions"));
        pomodoroSessionsElement.textContent = pomodoroSessions;
    }
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Notification system
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add("show");
        
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
    
    // Add task on Enter key
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Add fade-out animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        .fade-out {
            animation: fadeOut 0.3s ease forwards;
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
});;
