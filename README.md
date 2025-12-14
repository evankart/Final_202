# Faceted Search Interface for Large-Scale Climate Disasters

**Project Type:** Implementation

**Live website:** Hosted on Vercel at [https://climatedisasters.vercel.app](https://climatedisasters.vercel.app/)

## Summary

This project builds a faceted search interface for exploring NOAA's billion-dollar weather and climate disaster data from 1980 to present. This is an exhaustive dataset of over 400 qualifying events affecting the entire country. In 2024 alone, there were 27 disasters with over $1 billion of damage, with a cumulative cost of $182 billion and a death toll of 568. This illustrates the magnitude of the urgency needed in making this data more accessible. The original dataset was inadequately structured, so my goal was to improve its usability. The interface was build with React and Algolia, and allows users to search through events using a variety of attributes such as name, disaster type, and extent of damage. Each disaster record includes a name, date range, CPI-adjusted cost, death toll, summary, and category information and can be filtered based on these attributes. The goal of this project was to make this important climate data more accessible and explorable than its original form with imperfect structure.

## Data Collection and Preparation

The primary dataset comes from the U.S. Billion-Dollar Weather and Climate Disasters dataset available at https://catalog.data.gov/dataset/u-s-billion-dollar-weather-and-climate-disasters-1980-present-ncei-accession-02092681

This dataset tracks weather and climate events that each cause at least one billion dollars in damages, adjusted for inflation. The downloaded CSV contained core event information but lacked detailed summaries, so I also connected each event with its corresponding summary from the NOAA National Centers for Environmental Information (NCEI) U.S. Billion-Dollar Weather and Climate Disasters portal at https://www.ncei.noaa.gov/access/billions/state-summary/US. The original structure also had issues to address. For example, the location of each disaster was not explicitly in the event name making it difficult to search by location. The provided disaster type categories were also overly broad, with each event limited to just one type even when multiple could apply. I then converted the combined data from CSV into a JSON structure optimized for search and faceted navigation.

## Data Structuring and Organization

While the original NOAA dataset classified disasters into just seven event types, my implementation enhances this taxonomy with hierarchical subcategories. Individual events can also be assigned multiple categories where applicable, addressing the overlap problem in the original data.

Hierarchical Categories for Disaster Type:

| L1 | L2 | L3 | L4 |
|---|---|---|---|
| Severe Weather | Rain | Flooding | - |
| | Snow and Ice | Winter Storm | Ice Storm |
| | | | Blizzard |
| | Wind | Tornado | - |
| | | Tropical Cyclone | - |
| | | Derecho | - |
| | | Severe Storm | Hail Storm |
| Extreme Temperatures | Heat Events | Heat Wave | - |
| | | Drought | - |
| | Cold Events | Cold Wave | - |
| | | Freeze | - |
| Fire | Wildfire | Firestorm | - |

Severity Categories:

| Level | Cost Severity | Loss of Life Severity |
|---|---|---|
| None | N/A | 0 Deaths |
| Moderate | $1B to $2.5B | 1 to 10 Deaths |
| High | $2.5B to $5B | 10 to 50 Deaths |
| Very High | $5B to $10B | 50 to 100 Deaths |
| Extreme | $10B to $50B | 100 to 500 Deaths |
| Catastrophic | >= $50B | >= 1000 Deaths |

I created a combined overall severity attribute by taking the higher of the two individual severity ratings for any given record. This approach ensures that an event like a drought with extreme economic impact but low casualties is still classified appropriately based on its most significant dimension of harm. Each event is also assigned a US region and specific states where applicable, enabling geographic filtering and analysis.


### Connections to Class Concepts

This project touches on several topics we covered in class. The interface uses faceted navigation, allowing users to filter by severity, state, region, and other attributes that can be combined to narrow down the search results. I implemented hierarchical navigation for disaster types seen above, and used a controlled vocabulary for severity levels (None, Moderate, High, Very High, Extreme, Catastrophic) as well as states and regions so I could keep classification consistent across all events.  Each disaster record follows the same JSON metadata schema with fields for dates, costs, death tolls, categories, and location info. This structured approach to metadata ensures that every record can be consistently indexed and searched. Finally, users can sort results by relevance (the default setting), cost of damages, number of deaths, or date, supporting different research needs and use cases.

## Attribution

Images: All images sourced from [Unsplash](https://unsplash.com/) under their free license.

Code: I built my app based on components in the public documentation for the libraries used in my project, including [React](https://react.dev/reference/react-dom/components), [Bootstrap](https://react-bootstrap.netlify.app/docs/components/accordion), [Algolia](https://www.algolia.com/doc/), and [RC Slider](https://slider-react-component.vercel.app/).

## Use of Generative AI

I built the metadata strucutre for my JSON based off of previous projects from class. To save time writing each record by hand, I gave Claude an example JSON record along with the entire csv database of climate events and asked it to assemble the full JSON file for all events in the csv.  


### Task 1: JSON Record Generation

**Prompt:**
> Given this sample record, generate JSON for each record listed in the attached csv:

```json
{
    "objectID": "0",
    "Name": "U.S. Drought",
    "Disaster": "Drought",
    "Category": {
        "cat_level0": ["Extreme Temperature"],
        "cat_level1": ["Extreme Temperature > Heat"],
        "cat_level2": ["Extreme Temperature > Heat > Drought"]
    },
    "State": null,
    "Region": ["North", "South", "West", "East", "Central"],
    "Begin_Date": "1/1/08",
    "End_Date": "12/31/08",
    "CPI_Adjusted_Cost": 10444700000,
    "Unadjusted_Cost": 7009800000,
    "Cost_Severity": "Extreme",
    "Loss_of_Life": 0,
    "Loss_of_Life_Severity": "None",
    "Overall_Severity": "Extreme",
    "Summary": "Severe drought and heat caused agricultural losses...",
    "Begin_Date_Timestamp": 1199174400000,
    "End_Date_Timestamp": 1230710400000
}
```

**Output:**
> Generated 403 disaster records in JSON format matching your structure. Each record includes hierarchical categories, date strings formatted as M/D/YY, timestamps in milliseconds, regions as arrays, and all severity metrics and cost data.

**Review:**
The model produced disaster_records.json which is included in this repository. I checked the model's work by first scanning through all records for obvious errors and then reviewing a sample of 10 records to ensure the JSON structure was created correctly. All 10 sampled records were accurate with correct category assignments, properly formatted dates, and accurate cost/death toll figures matching the original CSV.

---

### Task 2: Event Summary Matching

I also gave Claude the list of event summaries to match to records in the CSV disaster database.

**Prompt:**
> Match the event summaries from this website https://www.ncei.noaa.gov/access/billions/state-summary/US with the records found in the following csv, creating a new summary column

**Output:**
> Matched all 403 event summaries to their corresponding records based on event name and date.

**Review:**
I did a thorough check of 25 records (approximately 6% of the dataset) to make sure the summaries were matched correctly. All 25 records had the correct summary matched to the correct event. I found Claude to be very well suited for this type of repetitive, structured task that would have taken much longer to complete by hand.
