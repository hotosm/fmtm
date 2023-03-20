import React, { useEffect, useState } from "react";
import '../styles/home.css'
import ExploreProjectCard from "../components/home/ExploreProjectCard";
import windowDimention from "../hooks/WindowDimension";
import { HomeSummaryService } from "../api/HomeService";
import enviroment from "../environment";
import ProjectCardSkeleton from "../components/home/ProjectCardSkeleton";
import SearchablesRow from "../components/home/HomePageFilters";
import CoreModules from "../shared/CoreModules";

const Home = () => {
   const state:any = useSelector<any>(state=>state.project.projectData)
   console.log('state main :',state)
    const[pageNumber, setPageNumber] = useState(1);

    const { type } = windowDimention();
    //get window dimension

    const dispatch = CoreModules.useDispatch()
    //dispatch function to perform redux state mutation

    const stateHome = CoreModules.useSelector((state) => state.home);
    //we use use selector from redux to get all state of home from home slice

    let cardsPerRow = new Array(type == 'xl' ? 7 : type == 'lg' ? 5 : type == 'md' ? 4 : type == 'sm' ? 3 : type == 's' ? 2 : 1).fill(0);
    //calculating number of cards to to display per row in order to fit our window dimension respectively and then convert it into dummy array

    const theme = CoreModules.useSelector(state => state.theme.hotTheme)
    useEffect(() => {
        dispatch(HomeSummaryService(`${enviroment.baseApiUrl}/projects/summaries?skip=0&limit=100`))
        //creating a manual thunk that will make an API call then autamatically perform state mutation whenever we navigate to home page
    }, [])


   const testData = [
       {
         "id": 1,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Stonetown2",
         "location_str": "Stonetown, Tanzania",
         "description": "test dataset3",
         "num_contributors": 5,
         "total_tasks": 204,
         "tasks_mapped": 4,
         "tasks_validated": 1,
         "tasks_bad": 46
       },
       {
         "id": 2,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Naivasha",
         "location_str": "Naivasha, Kenya",
         "description": "test dataset4",
         "num_contributors": 0,
         "total_tasks": 23,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 3,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 4,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience Centroids Only",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience Centroids Only",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 5,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "SUZA",
         "location_str": "Zanzibar, Tanzania",
         "description": "SUZA project",
         "num_contributors": 0,
         "total_tasks": 204,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 6,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Vulamba",
         "location_str": "Vulamba, Angola",
         "description": "test dataset2",
         "num_contributors": 0,
         "total_tasks": 69,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 7,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Stonetown2",
         "location_str": "Stonetown, Tanzania",
         "description": "test dataset3",
         "num_contributors": 5,
         "total_tasks": 204,
         "tasks_mapped": 4,
         "tasks_validated": 1,
         "tasks_bad": 46
       },
       {
         "id": 8,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Naivasha",
         "location_str": "Naivasha, Kenya",
         "description": "test dataset4",
         "num_contributors": 0,
         "total_tasks": 23,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 9,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 10,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience Centroids Only",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience Centroids Only",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 11,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "SUZA",
         "location_str": "Zanzibar, Tanzania",
         "description": "SUZA project",
         "num_contributors": 0,
         "total_tasks": 204,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 12,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Vulamba",
         "location_str": "Vulamba, Angola",
         "description": "test dataset2",
         "num_contributors": 0,
         "total_tasks": 69,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 13,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Stonetown2",
         "location_str": "Stonetown, Tanzania",
         "description": "test dataset3",
         "num_contributors": 5,
         "total_tasks": 204,
         "tasks_mapped": 4,
         "tasks_validated": 1,
         "tasks_bad": 46
       },
       {
         "id": 14,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Naivasha",
         "location_str": "Naivasha, Kenya",
         "description": "test dataset4",
         "num_contributors": 0,
         "total_tasks": 23,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 15,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 16,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience Centroids Only",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience Centroids Only",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 17,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "SUZA",
         "location_str": "Zanzibar, Tanzania",
         "description": "SUZA project",
         "num_contributors": 0,
         "total_tasks": 204,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 18,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Vulamba",
         "location_str": "Vulamba, Angola",
         "description": "test dataset2",
         "num_contributors": 0,
         "total_tasks": 69,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 19,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Stonetown2",
         "location_str": "Stonetown, Tanzania",
         "description": "test dataset3",
         "num_contributors": 5,
         "total_tasks": 204,
         "tasks_mapped": 4,
         "tasks_validated": 1,
         "tasks_bad": 46
       },
       {
         "id": 20,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Naivasha",
         "location_str": "Naivasha, Kenya",
         "description": "test dataset4",
         "num_contributors": 0,
         "total_tasks": 23,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 21,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 22,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Dominica Resilience Centroids Only",
         "location_str": "Roseau, Dominica",
         "description": "Dominica Resilience Centroids Only",
         "num_contributors": 0,
         "total_tasks": 42,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 23,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "SUZA",
         "location_str": "Zanzibar, Tanzania",
         "description": "SUZA project",
         "num_contributors": 0,
         "total_tasks": 204,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 24,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Vulamba",
         "location_str": "Vulamba, Angola",
         "description": "test dataset2",
         "num_contributors": 0,
         "total_tasks": 69,
         "tasks_mapped": 0,
         "tasks_validated": 0,
         "tasks_bad": 0
       },
       {
         "id": 25,
         "priority": 2,
         "priority_str": "MEDIUM",
         "title": "Stonetown2",
         "location_str": "Stonetown, Tanzania",
         "description": "test dataset3",
         "num_contributors": 5,
         "total_tasks": 204,
         "tasks_mapped": 4,
         "tasks_validated": 1,
         "tasks_bad": 46
       }
     ];
      

    return (
        <div style={{ padding: 7 }}>

            {/*pagingation*/}
 
            
            
            <SearchablesRow />

            {/*pagingationtop*/}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '1%' }}>
                <Pagination 
                    color="standard" 
                    count={Math.ceil(stateHome.homeProjectSummary.length/10)} 
                    variant="outlined"
                    onChange = {(event, pageNumber) => setPageNumber(pageNumber)} />
            </Box>

            {
                stateHome.homeProjectLoading == false ?
                    <Grid mt={2} container spacing={1} columns={{ xs: 1, sm: 3, md: 4, lg: 6, xl: 7 }}>


                        {stateHome.homeProjectSummary.slice((pageNumber - 1) * 10, pageNumber * 10).map((value, index) => (
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={index}>
                                <ExploreProjectCard data={value} key={index} />
                            </CoreModules.Grid>
                        ))}

            
                    </Grid>
                    : <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'flex', xl: 'flex', flexDirection: 'row', justifyContent: 'left', width: '100%' } }}>
                        <ProjectCardSkeleton defaultTheme={theme} cardsPerRow={cardsPerRow} />
                    </Box>

            }
            {/*pagingation bottom*/}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '1%' }}>
                <Pagination 
                    color="standard" 
                    count={Math.ceil(stateHome.homeProjectSummary.length/10)} 
                    variant="outlined"
                    onChange = {(event, pageNumber) => setPageNumber(pageNumber)} />
            </Box>

        </div>

    )

}

export default Home;
