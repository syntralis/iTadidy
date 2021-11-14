import "./card.scss";

const Card = ({ card, handleChoice, flipped }) => {
   const handleClick = () => {
      handleChoice(card);
   }
	return (
		<div className="card">
			<div className={flipped ? "flipped" : ""}>
				<img className="front" src={card.src} alt="card-front" draggable="false" />
				<img
					className="back"
					src="/cards/back.jpg"
					alt="card-back"
					draggable="false"
					onClick={handleClick}
				/>
			</div>
		</div>
	);
};

export default Card;
