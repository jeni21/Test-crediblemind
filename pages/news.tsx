import {useEffect, useState} from "react";
import { AppBar, Container, Avatar, Typography, Grid} from '@mui/material';
import client from "../lib/contentfulService";
import algoliaClient from '../lib/algoliaService';

import {
  InstantSearch,
  Hits,
  SearchBox,
  RefinementList
} from 'react-instantsearch-dom';

interface logo {
  fields: {
    file: {
      description: string;
      file: any;
      title: string
    }
  }
}

interface Fields {
  logo: logo;
  menuLabel: string;
  searchLabel: string;
  ttile: string;
}

interface newsDataType {
  fields: Fields;
  metadata?: any;
  sys?: any;
}

const News = () => {

  const tempData: newsDataType = {
    fields: {
      logo: {
        fields: {
          file: {
            description: '',
            file: '',
            title: ''
          }
        }
      },
      menuLabel: '',
      searchLabel: '',
      ttile: '',
    },
    metadata: {},
    sys: {}
  }
  const [newsData, setNewsData] = useState<newsDataType>(tempData);

  const getPage = async () => {
    const query = {
      content_type: 'newsConfig',
    };
    const { items: [page] } = await client.getEntries(query);
    return page || null;
  }

  const Hit = (props: any) => {

    const {hit: {imageUrl,name, topics, description,publicationDate, organization}} = props;
    return (
        <Grid container spacing={2} className="new-card">
          <Grid item xs={12} md={5} className="new-img">
            <img src={imageUrl} alt={name} />
          </Grid>
          <Grid item xs={12} md={7} className="content-detail">
            <Typography className="sub-title text-blue">{topics[0].title}</Typography>
            <Typography className="title-name">{name}</Typography>
            <Typography className="content-descripation">{description}</Typography>
            <div className="d-flex mt-3">
              <div className="new-date pe-3">
                <Typography>{publicationDate}</Typography>
              </div>
              <div className="new-type ps-3">
                <Typography className="text-blue">{organization[0].fields.name}</Typography>
              </div>
            </div>
          </Grid>
        </Grid>
    );
  }

  useEffect(  () => {
    getPage().then((data) => {
      setNewsData(data);
    });
  }, [])

  const {fields} = newsData;

  const {logo: {fields: {file}}, menuLabel, searchLabel, ttile} = fields

  return <>
    <AppBar position="static" className="bg-white shadow-none header-border-bottom">
      <Container>
        <div className="d-flex py-4 header-border-bottom">
          <Avatar className="w-auto" variant="square" src={file.url} alt={file.fileName} height={file.details?.image.height} width={file.details?.image.width} />
        </div>
        <div>
          <Typography className="text-grey py-3 text-20">{menuLabel}</Typography>
        </div>
      </Container>
    </AppBar>

    <div>
    </div>
    <section>
      <Container>
        <Typography variant="h4" className="text-darkgrey text-center fw-bold space-both">{ttile}</Typography>
      </Container>
    </section>

    <section>
      <Container>
        <InstantSearch indexName="news" searchClient={algoliaClient}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <div className="filter-card p-4">
                <Typography className="text-dark mb-3 text-18">{searchLabel}</Typography>
                <SearchBox />
              </div>
              <div className="mt-3">
                <RefinementList
                    attribute={"topics.title"}
                    showMore={true}
                    translations={{
                      showMore: isOpen => {
                        return isOpen ? "Show less" : "Show more";
                      }
                    }}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={9} className="ps-md-5 mt-4 mt-md-0">
              <div className="news-list">
                <Hits hitComponent={Hit} />
              </div>
            </Grid>
          </Grid>
        </InstantSearch>
      </Container>
    </section>
  </>;
}

export default News;
