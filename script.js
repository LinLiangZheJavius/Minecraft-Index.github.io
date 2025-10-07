//[] - create a list
//{} - create a dictionary that stores key-value pairs
//() - create ???


const databaseM = [
    {
        question : "Which is one is a neutral mob?",
        options : ["Fox", "Skeleton", "Blaze", "Zombified Piglin"],
        answer : "Zombified Piglin"
    },
    {
        question : "Which mob can you find in the Nether?",
        options : ["Creeper", "Skeleton", "Blaze", "Enderman"],
        answer : "Blaze"
    },
    {
        question : "Which mob shoots fireballs?",
        options : ["Blaze", "Wither Skeleton", "Piglin", "Skeleton"],
        answer : "Blaze"
    },
    {
        question : "Which one is NOT a mob?",
        options : ["Creeper", "Zombie", "Shulker", "Iron Golem"],
        answer : "Iron Golem"
    },
    {
        question : "Which one is a Boss mob?",
        options : ["Wither", "Blaze", "Creeper", "Snow Golem"],
        answer : "Wither"
    },
    {
        question : "How much health will be erased if you got struck by direct lightning?",
        options : ["1 heart", "3 hearts", "7 hearts", "10 hearts"],
        answer : "10 hearts"
    },
];

const DropDown = document.getElementById("drop-down");
const StartButton = document.getElementById("start");
const TimerText = document.getElementById("timer-text");
const QuestionLabel = document.getElementById("Q");
const OptionBox = document.getElementById("option-box");
const ProgressBarFill = document.getElementById("progress-bar-fill");
const ScoreLabel = document.getElementById('score');
const FeedbackLabel = document.getElementById('feedback');
const MusicBgm = document.getElementById('music-btn');
const MusicSelector = document.getElementById('bgm');

let CurrentSong = null;
let IsBgmPlaying = false;

// what happens when people select a song
MusicSelector.addEventListener('change', () => {
    const SongInputed = MusicSelector.value;

    // if the song cannot be inputted, deactivate the earlier function.
    if(!SongInputed) return;

    // if another song is played, stop and reset previous song if activated
    if(CurrentSong)
    {
        CurrentSong.pause();
        CurrentSong.currentTime = 0;
    }

    // load and play inputed song
    CurrentSong = new Audio(SongInputed);
    CurrentSong.loop = true;
    CurrentSong.volume = 1;
    CurrentSong.play();
    IsBgmPlaying = true;
    MusicBgm.textContent = "🎙️ The Concert Starts!!! 🎙️"
    MusicBgm.style.backgroundColor = "lime";
});



MusicBgm.addEventListener("click", () => {
    if(IsBgmPlaying)
    {
        CurrentSong.pause();
        MusicBgm.textContent = " 🚫 Music Off 🚫 "
        MusicBgm.style.backgroundColor = "red";
        IsBgmPlaying = false;
    } else
    {
        CurrentSong.play();
        MusicBgm.textContent = " 🎙️ The Concert Starts!!! 🎙️ ";
        MusicBgm.style.backgroundColor = "lime";
        IsBgmPlaying = true;
    }
});


StartButton.addEventListener("click", StartQuiz);

let timer;
let question_index = 0;
let score = 0;

function StartQuiz()
{
    StartButton.style.display = "none";
    DropDown.style.display = "none";
    LoadQuestion();
}

function LoadQuestion()
{
    // check if there are questions in the database that are yet to be loaded
    if(question_index < databaseM. length)
    {
        //clear feedback label
        FeedbackLabel.textContent = "";

        // reset timer
        TimerText.textContent = 15;

        // update the progress bar
        ProgressBarFill.style.width = `${( (question_index + 1) / databaseM.length) * 100 }%`;

        // load a question from the database
        const CurrentQuestionSet = databaseM[question_index];

        //erase previous option buttons
        OptionBox.innerHTML = '';
        QuestionLabel.textContent = CurrentQuestionSet.question;

        //clone all option buttons associated by a question
        CurrentQuestionSet.options.forEach((item) => {
            const button = document.createElement('button')
            button.textContent = item;
            button.classList.add('option-btn');
            OptionBox.appendChild(button);

            button.addEventListener('click', () => {
                DisableAllOptionButtons();
                CheckAsnwer(item);
            })
        });
        // turn on the timer
        timer = setInterval(() => {
        // reduce timer text by 1
        TimerText.textContent = parseInt(TimerText.textContent) - 1;

        if(parseInt(TimerText.textContent) === 0)
            {
                TimerText.textContent = 10

                clearInterval(timer); // to stop the timer
                DisableAllOptionButtons() === 0
                CheckAsnwer(null);
        }
        }, 1000);
    } else
    {
        EndQuiz();
    }
}


function EndQuiz()
{
    clearInterval(timer);
    QuestionLabel.textContent = "The Quiz has ended, you have been teleported to the Home Screen."
    FeedbackLabel.style.display = 'none';
    OptionBox.style.display = 'none';
    TimerText.style.fontSize = "55px";
    TimerText.textContent = "🥳🥳";
}

function DisableAllOptionButtons()
{
    const all_option_buttons = document.querySelectorAll('.option-btn')

    all_option_buttons.forEach(button => {
        button.disabled = true
    });
}

//item -> Player selected option
function CheckAsnwer(item)
{
    clearInterval(timer);

    const actual_ans = databaseM[question_index].answer
    let message = "";

    if( item === actual_ans)
    {
        score = score + 1;
        message = "That answer is correct! You earned a Minecoin!";
    } else if ( item === null)
    {
        message = " Time's Up! U got Robbed by Piglin Brutes!";
    } else
    {
        message = "Bzz! U answered wrong! You Died!";
    }

    FeedbackLabel.textContent = message;

    ScoreLabel.textContent = `You scored ${score} Minecoin(s).`;
    //hold for 2.5 sec. bef loading next question

    setTimeout (() => {
        question_index = question_index + 1;
        LoadQuestion();
    }, 2500);
}