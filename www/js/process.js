var setTimer = 0;
function clock(){
	let timer = <h1>{new Date().toLocaleTimeString()}</h1>;
	ReactDOM.render(timer,document.getElementById('timer'));	

	setTimer = setTimeout(function(){
		clock();
	},1000);
};

function stopClock(){
	clearInterval(setTimer);
}

let btn = <div>
				<div id='timer' className='text'></div>
				<div id='execute' className='text'></div>
				<div id='output' className='text'></div>
				<div id='error' className='text'></div>
				<div id='commands' className='text'></div>
				<div id='dbfile' className='text'></div>
				<div id='savedb' className='text'></div>
				<button onClick={clock}>Start Clock</button>
				<button onClick={stopClock}>Stop Clock</button>
			</div>;

ReactDOM.render(btn,document.getElementById('rangie'));