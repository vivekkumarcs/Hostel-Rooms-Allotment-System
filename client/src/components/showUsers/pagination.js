import React from "react";
class Pagination extends React.Component {
    state = { position: 1 };

    componentDidMount = () => {
        this.setState(() => ({
            totalPages: this.props.totalPages,
            reset: this.props.reset
        }));
    };
    UNSAFE_componentWillReceiveProps(props) {
        if (props.reset !== this.state.reset) {
            this.setState(() => ({ position: 1, reset: props.reset }));
        }
    }
    handleChange = e => {
        let position = this.state.position;
        if (e.target.id === "<<") {
            position -= 1;
        } else if (e.target.id === ">>") {
            position += 1;
        } else {
            position = parseInt(e.target.id);
        }
        if (position !== this.state.position) {
            if (this.props.pageChanged(position)) {
                this.setState(() => ({ position: position }));
            }
        }
    };

    show = () => {
        const position = this.state.position;
        const totalPages = this.state.totalPages;
        let A = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                A.push(
                    <button
                        id={i}
                        key={i}
                        onClick={this.handleChange}
                        className={
                            position === i
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        {i}
                    </button>
                );
            }
        } else {
            if (position === 1 || position === 2 || position === 3) {
                A = [
                    <button
                        id="1"
                        key={1}
                        onClick={this.handleChange}
                        className={
                            position === 1
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        1
                    </button>,
                    <button
                        id="2"
                        key={2}
                        onClick={this.handleChange}
                        className={
                            position === 2
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        2
                    </button>,
                    <button
                        id="3"
                        key={3}
                        onClick={this.handleChange}
                        className={
                            position === 3
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        3
                    </button>,
                    <button
                        id=">>"
                        key={4}
                        onClick={this.handleChange}
                        className="pagUnselected"
                    >
                        >>
                    </button>,
                    <button
                        id={totalPages}
                        key={5}
                        onClick={this.handleChange}
                        className={
                            position === totalPages
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        {totalPages}
                    </button>
                ];
            } else if (
                position === totalPages ||
                position === totalPages - 1 ||
                position === totalPages - 2
            ) {
                A = [
                    <button
                        id="1"
                        key={1}
                        onClick={this.handleChange}
                        className={
                            position === 1
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        1
                    </button>,
                    <button
                        id="<<"
                        key={2}
                        onClick={this.handleChange}
                        className="pagUnselected"
                    >
                        {"<<"}
                    </button>,
                    <button
                        id={totalPages - 2}
                        key={3}
                        onClick={this.handleChange}
                        className={
                            position === totalPages - 2
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        {totalPages - 2}
                    </button>,
                    <button
                        id={totalPages - 1}
                        key={4}
                        onClick={this.handleChange}
                        className={
                            position === totalPages - 1
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        {totalPages - 1}
                    </button>,
                    <button
                        id={totalPages}
                        key={5}
                        onClick={this.handleChange}
                        className={
                            position === totalPages
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        {totalPages}
                    </button>
                ];
            } else {
                A = [
                    <button
                        id="1"
                        key={1}
                        onClick={this.handleChange}
                        className={
                            position === 1
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        1
                    </button>,
                    <button
                        id="<<"
                        key={2}
                        onClick={this.handleChange}
                        className="pagUnselected"
                    >
                        {"<<"}
                    </button>,
                    <button
                        id={position}
                        key={3}
                        onClick={this.handleChange}
                        className="pagUnselected pagSelected"
                    >
                        {position}
                    </button>,
                    <button
                        id=">>"
                        key={4}
                        onClick={this.handleChange}
                        className="pagUnselected"
                    >
                        {">>"}
                    </button>,
                    <button
                        id={totalPages}
                        key={5}
                        onClick={this.handleChange}
                        className={
                            position === totalPages
                                ? "pagUnselected pagSelected"
                                : "pagUnselected"
                        }
                    >
                        {totalPages}
                    </button>
                ];
            }
        }
        return A;
    };

    render() {
        return <div className="pagWrapper">{this.show()}</div>;
    }
}

export default Pagination;
