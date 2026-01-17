import React, { useEffect, useState } from "react";
import campaign from "./../../../ethereum/campaign";
import { Card, Button, Icon,Grid } from "semantic-ui-react";
import Layout from "./../../../components/Layout";
import { useRouter } from "next/router";

import { Link } from "./../../../routes";

import "semantic-ui-css/semantic.min.css"; // ✅ Semantic UI CSS

import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Table,
} from 'semantic-ui-react'

const RequestIndex = () => {

    const [address, setAddress] = useState(null);
    const router = useRouter();

   useEffect(() => {

  const { address } = router.query;

  console.log(address);

    setAddress(address);
  }, [router.isReady, router.asPath]);



  return (
    <Layout>
        <h3>Requests</h3>

        <Grid>
            <Grid.Row>
                <Grid.Column width={10}>

                </Grid.Column>
                <Grid.Column width={6}>
                    <Link route={`/campaigns/${address}/requests/new`}>
                        <Button>Create Request</Button>
                    </Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
       
       
    </Layout>
  );
};

export default RequestIndex;
