import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'instantsearch.css/themes/satellite.css';
import 'rc-slider/assets/index.css';
import { Button, Badge } from 'react-bootstrap';
import { useState } from 'react';
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, RefinementList, HierarchicalMenu, useRange, Pagination, HitsPerPage, SortBy } from 'react-instantsearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCloudShowersHeavy, faThermometerEmpty } from '@fortawesome/free-solid-svg-icons';
import FilterSection from './components/FilterSection';
import CostSlider from './components/CostSlider';
import DateSlider from './components/DateSlider';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY
);

function App() {

  const [openHits, setopenHits] = useState(new Set());
  const [expandedFilters, setExpandedFilters] = useState({ type: true, cost: true, date: true });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // keep severity levels in consistent order
  const severityOrder = ['None', 'Moderate', 'High', 'Very High', 'Extreme', 'Catastrophic'];
  const getSeverityRank = (label) => {
    const i = severityOrder.indexOf(label);
    return i;
  };

  // open/close filter sections
  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // open/close summaries
  const toggleSummary = (hitId) => {
    setopenHits((prev) => {
      const next = new Set(prev);
      next.has(hitId) ? next.delete(hitId) : next.add(hitId);
      return next;
    });
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
    const isOpen = openHits.has(hit.objectID);

    return (
      <div className='row w-100'>
        {/* results list */}
        <div className='col-sm-8'>
          <h2>{hit.Name}</h2>
          <p className='text-secondary mb-2'>{formatDate(hit.Begin_Date)} - {formatDate(hit.End_Date)}</p>
          <Badge className='me-2' bg={severityDetails[hit.Loss_of_Life_Severity] || 'primary'}>{`${hit.Loss_of_Life.toLocaleString()} Deaths`}</Badge>
          <Badge className='me-1' bg={severityDetails[hit.Cost_Severity] || 'primary'}>{`$${(hit.CPI_Adjusted_Cost / 1000000000).toFixed(1)} Billion`}</Badge>
          <FontAwesomeIcon className='me-1' icon={categoryDetails[hit.Category.cat_level0[0]]?.icon} color="#444" />

          <div className='mt-2 text-left'>
            {!isOpen && (
              <>
                {/*  show summary snippet */}
                <span className='text-secondary small'>{hit.Summary.substring(0, 150)}... </span>
                <Button
                  variant="link"
                  className='p-0 text-secondary small mb-1'
                  style={{ display: 'inline', marginLeft: 0, fontSize: '0.875rem' }}
                  onClick={() => toggleSummary(hit.objectID)}
                >
                  (see more)
                </Button>
              </>
            )}
            {isOpen && (
              <>
                <p className='text-secondary small mb-2'>{hit.Summary}</p>
                <Button
                  variant="link"
                  className='p-0 text-secondary small mb-1'
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => toggleSummary(hit.objectID)}
                >
                  (see less)
                </Button>
              </>
            )}
          </div>

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
          <div className='row'>
            <div className='d-flex justify-content-end align-items-center gap-3 mb-2'>
              {/* Sort results by cost, death toll, date */}
              <SortBy
                items={[
                  { value: 'Climate Disasters', label: 'Most Relevant' },
                  { value: 'Climate Disasters_CPI_Adjusted_Cost', label: 'Cost (High to Low)' },
                  { value: 'Climate Disasters_Loss_of_Life', label: 'Deaths (High to Low)' },
                  { value: 'Climate Disasters_Begin_Date_Timestamp', label: 'Date (Newest to Oldest)' }
                ]}
              />

              <HitsPerPage
                items={[
                  { value: 10, label: '10 per page', default: true },
                  { value: 20, label: '20 per page' },
                  { value: 50, label: '50 per page' }
                ]}
              />
            </div>

            {/* Show filters */}
            <div className='col-md-5 col-lg-3'>
              <SearchBox className='mb-2' />
              <FilterSection title="Disaster Type" filterName="type" isOpen={expandedFilters.type} onToggle={toggleFilter}>
                <HierarchicalMenu
                  attributes={[
                    'Category.cat_level0',
                    'Category.cat_level1',
                    'Category.cat_level2',
                    'Category.cat_level3'
                  ]}
                />
              </FilterSection>

              <FilterSection title="CPI-Adjusted Cost" filterName="cost" isOpen={expandedFilters.cost} onToggle={toggleFilter}>
                <CostSlider attribute="CPI_Adjusted_Cost" />
              </FilterSection>

              <FilterSection title="Date Range" filterName="startDate" isOpen={expandedFilters.date} onToggle={toggleFilter}>
                <DateSlider attribute="Begin_Date_Timestamp" />
              </FilterSection>

              <FilterSection title="Economic Impact" filterName="impact" isOpen={expandedFilters.impact} onToggle={toggleFilter}>
                <RefinementList attribute="Cost_Severity" />
              </FilterSection>

              <FilterSection title="Loss of Life" filterName="life" isOpen={expandedFilters.life} onToggle={toggleFilter}>
                <RefinementList
                  attribute="Loss_of_Life_Severity"
                  transformItems={(items) => [...items].sort((a, b) => getSeverityRank(a.label) - getSeverityRank(b.label))}
                />
              </FilterSection>

              <FilterSection title="Overall Severity" filterName="severity" isOpen={expandedFilters.severity} onToggle={toggleFilter}>
                <RefinementList
                  attribute="Overall_Severity"
                  transformItems={(items) => [...items].sort((a, b) => getSeverityRank(a.label) - getSeverityRank(b.label))}
                />
              </FilterSection>

              <FilterSection title="State" filterName="state" isOpen={expandedFilters.state} onToggle={toggleFilter}>
                <RefinementList
                  attribute="State"
                  transformItems={(items) => [...items].sort((a, b) => a.label.localeCompare(b.label))}
                />
              </FilterSection>

              <FilterSection title="Region" filterName="region" isOpen={expandedFilters.region} onToggle={toggleFilter}>
                <RefinementList
                  attribute="Region"
                  transformItems={(items) => [...items].sort((a, b) => a.label.localeCompare(b.label))}
                />
              </FilterSection>

              <a href="/billion-dollar-events.csv" className='btn btn-primary w-100 mb-2 download-btn'>Download CSV</a>
              <a href="/billion-dollar-events.json" target='_blank' className='btn btn-primary w-100 mb-2 download-btn'>Download JSON</a>

            </div>

            {/* Show results */}
            <div className='col-md-7 col-lg-9'>
              <Hits hitComponent={Hit} />

              {/* Pagination */}
              <div className='mt-3 d-flex justify-content-center'>
                <Pagination showLast={true} />
              </div>
            </div>
          </div>

        </InstantSearch>

        <hr />
      </div>
    </div>
  );
}

export default App;
