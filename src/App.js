import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'instantsearch.css/themes/satellite.css';
import { Button, Modal, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, RefinementList, HierarchicalMenu, RangeInput } from 'react-instantsearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCloudShowersHeavy, faThermometerEmpty } from '@fortawesome/free-solid-svg-icons';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
)

function App() {

  const [modalOpen, setModalOpen] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const categoryDetails = {
    'Severe Weather': {
      icon: faCloudShowersHeavy,
      image: "https://images.unsplash.com/photo-1454789476662-53eb23ba5907?q=80&w=1352&auto=format&fit=crop"
    },
    'Extreme Temperature': {
      icon: faThermometerEmpty,
      image: "https://images.unsplash.com/photo-1593349783603-654a7069d88d?q=80&w=2342&auto=format&fit=crop"
    },
    'Fire': {
      icon: faFire,
      image: "https://images.unsplash.com/photo-1551207004-3e38b4f52ba6?q=80&w=1364&auto=format&fit=crop"
    }
  }

  const severityDetails = {
    'Catastrophic': 'danger',
    'Extreme': 'danger',
    'Very High': 'warning',
    'High': 'warning',
    'Moderate': 'warning',
    'None': 'success'
  }

  function Hit({ hit }) {
    return (
      <div className='row'>
        <div className='col-sm-8 mb-3'>
          <h2>{hit.Name}</h2>
          <p className='text-secondary'>{formatDate(hit.Begin_Date)} - {formatDate(hit.End_Date)}</p>
          <span>

          </span>
          <Badge className='me-2' bg={severityDetails[hit.Loss_of_Life_Severity] || 'primary'}>{`${hit.Loss_of_Life.toLocaleString()} Deaths`}</Badge>
          <Badge className='me-1' bg={severityDetails[hit.Cost_Severity] || 'primary'}>{`$${(hit.CPI_Adjusted_Cost / 1000000000).toFixed(1)} Billion`}</Badge>
          <FontAwesomeIcon className='me-1' icon={categoryDetails[hit.Category.cat_level0[0]]?.icon} color="#444" />
        </div >
        <div className='col-sm-4'>
          <img src={categoryDetails[hit.Category.cat_level0[0]]?.image} className="img-fluid rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="mt-3">
        <h1 className='text-center'>Billion-Dollar Climate Disasters</h1>
      </header>

      <div className={'container-fluid '}>

        <InstantSearch searchClient={searchClient} indexName="Climate Disasters">
          <Button className='mb-2 w-100' variant="primary" onClick={() => setModalOpen(true)}>Download Data</Button>
          <SearchBox />

          {/* Filters */}
          <div>
            <h3>Disaster Type</h3>
            <HierarchicalMenu
              attributes={[
                'Category.cat_level0',
                'Category.cat_level1',
                'Category.cat_level2',
                'Category.cat_level3'
              ]}
            />

            <hr />

            <h3>Economic Impact</h3>
            <RefinementList attribute="Cost_Severity" />

            <hr />

            <h3>Loss of Life</h3>
            <RefinementList attribute="Loss_of_Life_Severity" />

            <hr />

            <h3>Overall Severity</h3>
            <RefinementList attribute="Overall_Severity" />

            <h3>CPI-Adjusted Cost Range</h3>
            <RangeInput attribute="CPI_Adjusted_Cost" />

            <hr />

            <h3>State</h3>
            <RefinementList attribute="State" />

            <hr />

            <h3>Year</h3>
            {/* <RefinementList attribute="Year" /> */}

            <hr />

            <h3>Region</h3>
            <RefinementList attribute="Region" />

            <hr />

            <h3>Start Date</h3>
            <RefinementList attribute="Start_Date" />

            <hr />

            <h3>End Date</h3>
            <RefinementList attribute="End_Date" />

            <hr />
          </div>

          <br />

          {/* Search Results */}
          <h2 className='text-center'>Results</h2>
          <Hits hitComponent={Hit} />

        </InstantSearch>

        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
          <Modal.Header closeButton className='border-0'>
            <Modal.Title>Download This Dataset</Modal.Title>
          </Modal.Header>
          <Button className='m-2' variant="primary">Download CSV</Button>
        </Modal>

        <hr />
      </div>
    </div>
  );
}

export default App;
