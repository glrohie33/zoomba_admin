import React, {Fragment} from 'react';
import {Card, Grid} from "@mui/material";
import OrdersTable from "../components/ordersTable";

function Dashboard(props) {
    return (
        <Fragment>
            <div> <h3>Dashboard</h3></div>

            <Grid container spacing={2} className={'dashboard-data'}>
                <Grid item sm={3} className={'data'}>
                    <Card>
                        <p>Stores</p>
                        <h3>20</h3>
                    </Card>
                </Grid>
                <Grid item sm={3} className={'data'}>
                    <Card>
                        <p>Users</p>
                        <h3>10</h3>
                    </Card>
                </Grid>
                <Grid item sm={3} className={'data'}>
                    <Card>
                        <p>Vendors</p>
                        <h3>20</h3>
                    </Card>
                </Grid>
                <Grid item sm={3} className={'data'}>
                    <Card>
                        <p>Orders</p>
                        <h3>30</h3>
                    </Card>
                </Grid>

                <Grid item sm={12} className={'order-table'}>
                    <Card>
                        <h5>New Orders</h5>
                        <OrdersTable limit={5}/>
                    </Card>
                </Grid>
            </Grid>


        </Fragment>
    );
}

export default Dashboard;