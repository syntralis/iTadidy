import "./game.scss";
import { useState, useEffect, useRef } from "react";
import Parallax from "parallax-js";

//Music
import Sound from "react-sound";
import bgm from "./assets/bg-music.mp3";

import soundOn from "./assets/sound-on.png";
import soundOff from "./assets/sound-off.png";

import logo from "./assets/logo.png";
import playBtn from "./assets/play.png";
import prevBtn from "./assets/prev.png";
import restartBtn from "./assets/restart.png";

import Card from "./components/card";

const cardImages1 = [
	{ src: "/cards/1.jpg", matched: false },
	{ src: "/cards/2.jpg", matched: false },
	{ src: "/cards/3.jpg", matched: false },
	{ src: "/cards/4.jpg", matched: false },
];
const cardImages2 = [
	{ src: "/cards/1.jpg", matched: false },
	{ src: "/cards/2.jpg", matched: false },
	{ src: "/cards/3.jpg", matched: false },
	{ src: "/cards/4.jpg", matched: false },
	{ src: "/cards/5.jpg", matched: false },
	{ src: "/cards/6.jpg", matched: false },
];
const cardImages3 = [
	{ src: "/cards/1.jpg", matched: false },
	{ src: "/cards/2.jpg", matched: false },
	{ src: "/cards/3.jpg", matched: false },
	{ src: "/cards/4.jpg", matched: false },
	{ src: "/cards/5.jpg", matched: false },
	{ src: "/cards/6.jpg", matched: false },
	{ src: "/cards/7.jpg", matched: false },
	{ src: "/cards/8.jpg", matched: false },
	{ src: "/cards/9.jpg", matched: false },
];

const turns1 = 12;
const turns2 = 20;
const turns3 = 40;

const flipResetDuration = 600;

const gameOverText = {win: "Mafy elah !", lose: "Mila ezaka..."}

const Game = () => {
	//#region Initialisation de la librairie Parallax.js
	const sceneEl = useRef(null);

	useEffect(() => {
		const parallaxInstance = new Parallax(sceneEl.current, {
			relativeInput: true,
			hoverOnly: true,
		});
		parallaxInstance.enable();
		return () => parallaxInstance.disable();
	}, []);
	//#endregion

	// Musiques
	const [bgmPlaying, setBgmPlaying] = useState(false);

	// Etapes (0: Accueil, 1: Selection du niveau, 2: Jeu)
	const [step, setStep] = useState(0);

	//#region Initialisation des cartes
	const [level, setLevel] = useState(0);
	const [cards, setCards] = useState([]);
	const [remainingTurns, setRemainingTurns] = useState(100);
	const [matchedCards, setMatchedCards] = useState(0);

	const [choice1, setChoice1] = useState(null);
	const [choice2, setChoice2] = useState(null);
	const [showAllCards, setShowAllCards] = useState(false);
	// Mélanger les cartes
	const shuffleCards = (n, a, b) => {
		setRemainingTurns(
			n === cardImages1 ? turns1 : n === cardImages2 ? turns2 : turns3
		);
		const shuffled = [...n, ...n]
			.sort(() => Math.random() - 0.5)
			.map((card) => ({ ...card, id: Math.random() }));

		setCards(shuffled);
		setTimeout(() => setShowAllCards(true), a);
		setTimeout(() => setShowAllCards(false), b);
		setGameOver(false);
		setWin(false);
		setMatchedCards(0);
	};
	//#endregion

	// Quand on choisit une des cartes
	const handleChoice = (card) => {
		if (choice1) {
			setChoice2(card);
			setRemainingTurns((prev) => prev - 1);
			if (remainingTurns <= 0) {
				outOfTurn();
			}
		} else {
			setChoice1(card);
			setRemainingTurns((prev) => prev - 1);
		}
	};

	// Comparer les 2 states avec UseEffect + Dependencies
	useEffect(() => {
		if (choice1 && choice2) {
			if (choice1.src === choice2.src) {
				setCards((prevCard) => {
					return prevCard.map((card) => {
						if (card.src === choice1.src) {
							setMatchedCards(matchedCards + 2);
							return { ...card, matched: true };
						} else {
							return card;
						}
					});
				});
				resetTurn();
			} else {
				setTimeout(() => resetTurn(), flipResetDuration);
			}
		}
	}, [choice1, choice2, matchedCards]);

	// Remettre le tour
	const resetTurn = () => {
		setChoice1(null);
		setChoice2(null);
	};

	// GameOver
	const [gameOver, setGameOver] = useState(false)
	const [win, setWin] = useState(false)
	const outOfTurn = () => {
		if (cards.some(e => e.matched === false)) {
			setWin(false)
		}
		else {
			setWin(true)
		}
		setGameOver(true)
	}


	// Detecteur du Game Over à chaque fois qu'on Flip une carte
	useEffect(() => {
		if (matchedCards === cards.length) {
			setWin(true);
			setTimeout(() => {
				setGameOver(true);
			}, 750)
		}
		if (remainingTurns <= 0) {
			setTimeout(() => {
				setGameOver(true);
			}, 750)
		}
	}, [matchedCards, cards.length, remainingTurns])

	return (
		<div className="game">
			<Sound
				url={bgm}
				playStatus={
					bgmPlaying ? Sound.status.PLAYING : Sound.status.STOPPED
				}
				loop={true}
			></Sound>
			<div className="bg">
				<div className="parallax" ref={sceneEl}>
					<div className="layer-1" data-depth="0.05"></div>
					<div className="layer-2" data-depth="0.1"></div>
					<div className="layer-3" data-depth="0.2"></div>
					<div className="layer-4" data-depth="0.4"></div>
				</div>
			</div>
			<button
				className="sound"
				onClick={() => {
					setBgmPlaying(!bgmPlaying);
				}}
			>
				<img src={bgmPlaying ? soundOn : soundOff} alt="" />
			</button>

			{step === 0 ? (
				<div className="home">
					<div className="logo">
						<img src={logo} alt="" />
					</div>
					<button
						className="play"
						onClick={() => {
							setStep(1);
						}}
					>
						<img src={playBtn} alt="" />
					</button>
				</div>
			) : step === 1 ? (
				<div className="level">
					<button
						className="prev"
						onClick={() => {
							setStep(0);
						}}
					>
						<img src={prevBtn} alt="" />
					</button>
					<div className="logo">
						<img src={logo} alt="" />
					</div>
					<div className="list">
						<button
							onClick={() => {
								setLevel(1);
								setStep(2);
								shuffleCards(cardImages1, 350, 1350);
							}}
						>
							2x4
						</button>
						<button
							onClick={() => {
								setLevel(2);
								setStep(2);
								shuffleCards(cardImages2, 350, 1350);
							}}
						>
							3x4
						</button>
						<button
							onClick={() => {
								setLevel(3);
								setStep(2);
								shuffleCards(cardImages3, 350, 1350);
							}}
						>
							3x6
						</button>
					</div>
				</div>
			) : (
				<div className="main">
					<button
						className="prev"
						onClick={() => {
							setStep(1);
						}}
					>
						<img src={prevBtn} alt="" />
					</button>
					<button
						className="restart ui"
						onClick={() => {
							shuffleCards(level === 1 ? cardImages1 : (level === 2 ? cardImages2 : cardImages3), 0, 1000)
						}}
					>
						<img src={restartBtn} alt="" />
					</button>
					<div className="container">
						<p className="remainingTurns">
							Afaka mamadika karatra in-<span>{remainingTurns}</span> sisa ianao.
						</p>
						<div
							className="card-grid"
							style={
								level === 1 || level === 2
									? { gridTemplateColumns: "1fr 1fr 1fr 1fr" }
									: { gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr" }
							}
						>
							{cards.map((card) => (
								<Card
									key={card.id}
									card={card}
									handleChoice={handleChoice}
									flipped={
										card === choice1 ||
										card === choice2 ||
										card.matched ||
										showAllCards
									}
								/>
							))}
						</div>
					</div>

					<div className="popup bravo" style={gameOver ? {display: "flex"} : {display: "none"}}>
						<div className="container">
							<h2>{win ? gameOverText.win : gameOverText.lose}</h2>
							<button
								className="restart"
								onClick={() => {
									shuffleCards(level === 1 ? cardImages1 : (level === 2 ? cardImages2 : cardImages3), 0, 1000);
								}}
							>
								<img src={restartBtn} alt="" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Game;
