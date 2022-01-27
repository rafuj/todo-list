import { Container } from "react-bootstrap";
import "./index.sass";
import Layout from "./Layout";
const App = () => {
	return (
		<section className="py-5">
			<Container>
				<h1 className="text__base text-center mb-4">My Todo List</h1>
				<Layout />
			</Container>
		</section>
	);
};

export default App;
