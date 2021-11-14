import logo from "./assets/logo.png";
import playBtn from "./assets/play.png";
const Home = () => {
	return (
		<div className="home">
			<div className="logo">
				<img src={logo} alt="" />
			</div>
         <button className="play">
            <img src={playBtn} alt="" />
         </button>
		</div>
	);
};

export default Home;
