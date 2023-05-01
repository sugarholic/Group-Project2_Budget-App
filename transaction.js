import axios from "axios";

function app () {
    const [allTransactions, setAllTransactions] = useState(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);

    useEffect(() => getAllTrans(), [allTransactions]);

    const getAllTrans = () => {
        axios
        .get("http://localhost:8080/budget")
        .then((res) => {
            setAllTransactions(res.data);
        })
        .catch((err) => console.log(err));
    };

    const handleDelete = (id) => {
        axios
        .delete(`http://localhost:8080/budget/${id}`)
        .catch((err) => console.log(err));
    };
}

module.exports = app;