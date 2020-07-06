import React from "react";
import SearchPanel from "./searchPanel";
import ContentTable from "./ContentTable";
import Pagination from "./pagination";
import ModalLoad from "../LoadingModal.js";
import { showUsers } from "../../utils/backend/admin";

// will get the hostelid and total users from calling component as props
class ShowUsers extends React.Component {
    constructor(props) {
        super(props);
        //console.log(props.hostel);
        this.state = {
            hostelName: props.hostel.name,
            totalUsers: props.hostel.users,
            hostelid: props.hostel._id,
            limit: 20,
            Users: [],
            search: null,
            sortBy: "rank",
            order: "asc",
            reset: true,
            modalshow: undefined,
        };
    }

    componentDidMount = async () => {
        this.setState(() => ({ modalshow: true }));
        await this.loadData(0, "rank", "asc", "");
        this.setState(() => ({ modalshow: undefined }));
    };

    loadData = async (skip, sortBy, order, search) => {
        try {
            // backend call
            const data = await showUsers(
                this.state.hostelid,
                skip,
                this.state.limit,
                sortBy,
                order,
                search
            );

            this.setState(() => ({ Users: data.data }));
            return true;
        } catch (e) {
            return false;
        }
    };

    submitted = async (data) => {
        const loaded = await this.loadData(
            0,
            data.sortBy,
            data.order,
            data.search
        );
        if (loaded) {
            this.setState((prevState) => ({
                sortBy: data.sortBy,
                order: data.order,
                search: data.search,
                reset: !prevState.reset,
            }));
        }
    };

    pageChanged = async (pageNo) => {
        let skip = (pageNo - 1) * this.state.limit;
        return await this.loadData(
            skip,
            this.state.sortBy,
            this.state.order,
            ""
        );
    };
    todaysDate = (given) => {
        if (!given) return false;
        return given === new Date().setHours(0, 0, 0, 0);
    };

    render() {
        return (
            <div className="ShowUsers">
                {this.state.modalshow && <ModalLoad />}
                <button
                    className="swCloseButton"
                    onClick={(e) => this.props.closeUsers()}
                >
                    X
                </button>
                {this.state.totalUsers === 0 && <b>No Users to show</b>}
                {this.state.totalUsers !== 0 && (
                    <h3>Users of {this.state.hostelName}</h3>
                )}
                {this.state.totalUsers !== 0 && (
                    <SearchPanel submitted={this.submitted} />
                )}
                {this.state.totalUsers !== 0 &&
                    this.state.Users.length === 0 && <h3>No users Found!!</h3>}
                {this.state.Users.length !== 0 && (
                    <ContentTable
                        Users={this.state.Users}
                        disabled={this.todaysDate(this.props.hostel.Date)}
                    />
                )}
                {this.state.totalUsers > this.state.limit &&
                    !this.state.search && (
                        <Pagination
                            totalPages={Math.ceil(
                                this.state.totalUsers / this.state.limit
                            )}
                            pageChanged={this.pageChanged}
                            reset={this.state.reset}
                        />
                    )}
            </div>
        );
    }
}

export default ShowUsers;
