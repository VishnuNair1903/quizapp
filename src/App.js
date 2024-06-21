import './App.css';
import { useState, useRef} from 'react';
import DragItem from './DragItem';
import DropTarget from './DropTarget';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {

  const question=[
    {
      id:1,
      questionText:'What is the capital of France?',
      answerOptions:[
        {answerText:'New York',isCorrect:false},
        {answerText:'London',isCorrect:false},
        {answerText:'Paris',isCorrect:true},
        {answerText:'Dublin',isCorrect:false}
,      ],
      multipleCorrect:false
    },
    {
      id:2,
      questionText:'What is the capital of Ireland?',
      answerOptions:[
        {answerText:'Ne York',isCorrect:false},
        {answerText:'London',isCorrect:true},
        {answerText:'Paris',isCorrect:false},
        {answerText:'Dublin',isCorrect:true}
      ],
      multipleCorrect:true
    },
    {
      id:3,
      questionText:'What is the capital of England?',
      answerOptions:[
        {answerText:'New Yrk',isCorrect:false},
        {answerText:'London',isCorrect:true},
        {answerText:'Paris',isCorrect:false},
        {answerText:'Dublin',isCorrect:false}
      ],
      multipleCorrect:false
    },
    {
      id:4,
      questionText:'The currency of Japan is _________',
      answerOptions:[],
      correctAnswers:'Yen',
      type:'fillInBlank'
    },
    {
      id:5,
      questionText:'Match the foll:',
      answerOptions:[],
      type:'matchTheFollowing',
      pairs:[
        {question:'Cat', answer:'Meow'},
        {question:'Dog', answer:'Bark'},
        {question:'Cow', answer:'Moo'},
        {question:'Tiger', answer:'Roar'},
        
      ]
    }
    
  ]

  const [selectedAnswers, setSelectedAnswers]=useState([])
  const [currentQuestion, setCurrentQuestion]=useState(0)
  const [userInput, setUserInput]=useState('');
  const [matchedPairs, setMatchedPairs]=useState({});
  

  const questionRef=useRef({});
  const answerRef=useRef({});

  


  const handleAnswerOptionClick=(index, isCorrect)=>{

    if(question[currentQuestion].multipleCorrect){
      setSelectedAnswers((prev)=>{
        if(prev.includes(index)){
          return prev.filter((item)=>item!==index)
        }else{
          return [...prev,index]
        }
      });
      }else{
        handleNextQuestion(isCorrect)
      }
      
        

  };
  

  const handleNextQuestion=(isCorrect)=>{
    if (question[currentQuestion].multipleCorrect) {
      const correctAnswers = question[currentQuestion].answerOptions
        .map((option, index) => (option.isCorrect ? index : null))
        .filter((item) => item !== null);

      const allCorrect = selectedAnswers.every((ans) =>
        correctAnswers.includes(ans)
      );
      const allSelect = correctAnswers.every((ans) =>
        selectedAnswers.includes(ans)
      );

      if (allCorrect && allSelect) {
        alert('Correct Answer');
        const next = currentQuestion + 1;
        if (next < question.length) {
          setCurrentQuestion(next);
        }
      } else {
        alert('Wrong Answer');
      }

      setSelectedAnswers([]);
    } else if (question[currentQuestion].type === 'fillInBlank') {
      if (
        userInput.toLowerCase() ===
        question[currentQuestion].correctAnswers.toLowerCase()
      ) {
        alert('Correct Answer');
        const next = currentQuestion + 1;
        if(next<question.length){
          setCurrentQuestion(next);
        }else{
          alert('Quiz Completed');
        }
      } else {
        alert('Wrong Answer');
        console.log('User Input:', userInput);
      }
      setUserInput('');
    } else if (question[currentQuestion].type === 'matchTheFollowing') {
      const allCorrect = question[currentQuestion].pairs.every(
        (pair) => matchedPairs[pair.question] === pair.answer
      );

      if (allCorrect) {
        alert('Correct Answer');
        const next = currentQuestion + 1;
        if (next < question.length) {
          setCurrentQuestion(next);
          setMatchedPairs({});
        } else {
          alert('Quiz Completed');
        }
      } else {
        alert('Wrong Answer');
      }
    } else {
      if (!isCorrect) {
        alert('Wrong Answer');
      } else {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < question.length) {
          setCurrentQuestion(nextQuestion);
        } else {
          alert('Quiz Completed');
        }
      }
    }
  }

  const handleInputChange=(e)=>{
    setUserInput(e.target.value)
  }

  const handleDrop=(answerId, questionId)=>{
    setMatchedPairs((prev)=>({
      ...prev,
      [questionId]:answerId,
    }))

  }

  

  const renderMatchQuestion = () => {
    const pairs = question[currentQuestion].pairs;
    return (
      <div className="match-container">
        <div className="match-questions">
          {pairs.map((pair, index) => (
            <div>
              <div>{pair.question}</div>
              <DropTarget key={index} id={pair.question} onDrop={(item)=>handleDrop(item.id, pair.question)} ref={(el)=>(questionRef.current[pair.question]=el)}>
                {matchedPairs[pair.question]}
              
              </DropTarget>
            </div>
          ))}
        </div>
        <div className="match-answers">
          {pairs.map((pair, index) => (
            <DragItem
              key={index}
              id={pair.answer}
              text={pair.answer}
              
              ref={(el) => (answerRef.current[pair.answer] = el)}
            />
          ))}
        </div>
      </div>
    );
  };


  

  


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {question[currentQuestion].type === 'matchTheFollowing' ? (
          <div>
            {renderMatchQuestion()}
            <button onClick={()=>handleNextQuestion()} style={
              {margin:'10px',}
              
              
            
            }>Submit Answer</button>
          </div>
        ) : (
          <>
            <div className="question">
              <div className="question-count">Question 1</div>
              <div className="question-text">
                {question[currentQuestion].questionText}
              </div>
            </div>
            <div className="answer">
              {question[currentQuestion].answerOptions.map((ans, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleAnswerOptionClick(index, ans.isCorrect);
                  }}
                >
                  {ans.answerText}
                </button>
              ))}

              {question[currentQuestion].multipleCorrect && (
                <button onClick={handleNextQuestion}>Submit Answer</button>
              )}
              {question[currentQuestion].type === 'fillInBlank' && (
                <div className='fill'>
                  <input
                    type="text"
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Enter your answer"
                  />
                  <button onClick={handleNextQuestion}>Submit Answer</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
