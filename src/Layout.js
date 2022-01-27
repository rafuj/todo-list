import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Col,
	Form,
	FormControl,
	InputGroup,
	Row,
} from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { BsCheck2Circle, BsTrash } from "react-icons/bs";

const getLocalStorage = () => {
	let list = localStorage.getItem("list");
	return list ? JSON.parse(list) : [];
};

const Layout = () => {
	const jobRef = useRef();
	const [list, setList] = useState(getLocalStorage());
	const [job, setJob] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [editID, setEditID] = useState(null);
	const [alert, setAlert] = useState({
		show: false,
		type: "",
		msg: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!job) {
			showAlert(true, "danger", "Please Enter a Todo Work");
		} else if (job && isEditing) {
			setList(
				list.map((item) => {
					if (item.id === editID) {
						return { ...item, title: job };
					}
					return item;
				})
			);
			setJob("");
			setEditID(null);
			setIsEditing(false);
			showAlert(true, "success", "Successfully Updated The Job");
		} else {
			showAlert(
				true,
				"success",
				"Successfully Added a New Task to Todo list"
			);
			const newItem = { id: new Date().getTime().toString(), title: job };
			setList([...list, newItem]);
			setJob("");
		}
	};
	const showAlert = (show = false, type = "", msg = "") => {
		setAlert({ show, type, msg });
	};
	const clearList = () => {
		setList([]);
		showAlert(true, "danger", "Empty List");
	};
	const removeItem = (id) => {
		showAlert(true, "danger", "Successfully Removed");
		setList(list.filter((item) => item.id !== id));
		if (list.length === 1) {
			showAlert(true, "danger", "Empty List");
		}
	};
	const jobDone = (id) => {
		showAlert(true, "success", "Successfully Completed a Task");
		setList(list.filter((item) => item.id !== id));
	};
	const editItem = (id) => {
		const specificItem = list.find((item) => item.id === id);
		setIsEditing(true);
		setEditID(id);
		setJob(specificItem.title);
		jobRef.current.focus();
	};
	useEffect(() => {
		const alertInterval = setTimeout(() => {
			showAlert();
		}, 3000);

		return () => {
			clearTimeout(alertInterval);
		};
	}, [list]);
	useEffect(() => {
		localStorage.setItem("list", JSON.stringify(list));
	}, [list]);

	return (
		<Row className="justify-content-center">
			<Col lg="6">
				<Form onSubmit={handleSubmit}>
					<InputGroup className="mb-3">
						<FormControl
							ref={jobRef}
							placeholder="Enter Work Name"
							value={job}
							onChange={(e) => setJob(e.target.value)}
						/>
						<button
							className="bg__base bg__base input-group-text"
							type="submit"
						>
							Add Todo
						</button>
					</InputGroup>
				</Form>
				{alert.show && (
					<Alert className={`alert-${alert.type}`}>{alert.msg}</Alert>
				)}
				<ul className="todo__list">
					{list &&
						list
							.map((item) => (
								<li key={item.id}>
									<span onClick={() => jobDone(item.id)}>
										{<BsCheck2Circle />}
									</span>
									{item.title}
									<span
										className="ms-auto edit__can"
										onClick={() => editItem(item.id)}
									>
										<AiFillEdit />
									</span>
									<span
										className="trash__can"
										onClick={() => removeItem(item.id)}
									>
										<BsTrash />
									</span>
								</li>
							))
							.reverse()}
				</ul>
				<div className="text-center">
					<div className="clear__list" onClick={() => clearList()}>
						Clear List
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default Layout;
