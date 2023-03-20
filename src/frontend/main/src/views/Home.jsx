import React, { useEffect, useState } from "react";
import "../styles/home.css";
import ExploreProjectCard from "../components/home/ExploreProjectCard";
<<<<<<< HEAD:src/frontend/main/src/views/Home.jsx
import windowDimention from "../hooks/WindowDimension";
=======
import Box from "@mui/material/Box";
import { Container, Grid, Pagination, TableRow } from "@mui/material";
import windowDimention from "../hooks/WindowDimension";
import BasicPagination from "../utilities/BasicPagination";
import { useDispatch, useSelector } from "react-redux";
>>>>>>> 2aa2f19f (Removed testdata from home.tsx):src/frontend/main/src/views/Home.tsx
import { HomeSummaryService } from "../api/HomeService";
import enviroment from "../environment";
import ProjectCardSkeleton from "../components/home/ProjectCardSkeleton";
import SearchablesRow from "../components/home/HomePageFilters";
<<<<<<< HEAD:src/frontend/main/src/views/Home.jsx
import CoreModules from "../shared/CoreModules";
=======
>>>>>>> 2aa2f19f (Removed testdata from home.tsx):src/frontend/main/src/views/Home.tsx

const Home = () => {
  const state: any = useSelector<any>((state) => state.project.projectData);
  console.log("state main :", state);
  const [pageNumber, setPageNumber] = useState(1);

  const { type } = windowDimention();
  //get window dimension

<<<<<<< HEAD:src/frontend/main/src/views/Home.jsx
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
=======
  const dispatch = useDispatch();
  //dispatch function to perform redux state mutation

  const stateHome = useSelector((state: any) => state.home);
  //we use use selector from redux to get all state of home from home slice

  let cardsPerRow: any = new Array(
    type == "xl"
      ? 7
      : type == "lg"
      ? 5
      : type == "md"
      ? 4
      : type == "sm"
      ? 3
      : type == "s"
      ? 2
      : 1
  ).fill(0);
  //calculating number of cards to to display per row in order to fit our window dimension respectively and then convert it into dummy array

  const theme: any = useSelector<any>((state) => state.theme.hotTheme);
  useEffect(() => {
    dispatch(
      HomeSummaryService(
        `${enviroment.baseApiUrl}/projects/summaries?skip=0&limit=100`
      )
    );
    //creating a manual thunk that will make an API call then autamatically perform state mutation whenever we navigate to home page
  }, []);
>>>>>>> 2aa2f19f (Removed testdata from home.tsx):src/frontend/main/src/views/Home.tsx

  return (
    <div style={{ padding: 7 }}>
      {/*pagingation*/}

      <SearchablesRow />

      {/*pagingationtop*/}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "1%",
        }}
      >
        <Pagination
          color="standard"
          count={Math.ceil(stateHome.homeProjectSummary.length / 10)}
          variant="outlined"
          onChange={(event, pageNumber) => setPageNumber(pageNumber)}
        />
      </Box>

<<<<<<< HEAD:src/frontend/main/src/views/Home.jsx
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
=======
      {stateHome.homeProjectLoading == false ? (
        <Grid
          mt={2}
          container
          spacing={1}
          columns={{ xs: 1, sm: 3, md: 4, lg: 6, xl: 7 }}
        >
          {stateHome.homeProjectSummary
            .slice((pageNumber - 1) * 10, pageNumber * 10)
            .map((value, index) => (
              <Grid item xs={1} sm={1} md={1} lg={1} xl={1} key={index}>
                <ExploreProjectCard data={value} key={index} />
              </Grid>
            ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: {
              xs: "flex",
              sm: "flex",
              md: "flex",
              lg: "flex",
              xl: "flex",
              flexDirection: "row",
              justifyContent: "left",
              width: "100%",
            },
          }}
        >
          <ProjectCardSkeleton defaultTheme={theme} cardsPerRow={cardsPerRow} />
        </Box>
      )}
      {/*pagingation bottom*/}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "1%",
        }}
      >
        <Pagination
          color="standard"
          count={Math.ceil(stateHome.homeProjectSummary.length / 10)}
          variant="outlined"
          onChange={(event, pageNumber) => setPageNumber(pageNumber)}
        />
      </Box>
    </div>
  );
};
>>>>>>> 2aa2f19f (Removed testdata from home.tsx):src/frontend/main/src/views/Home.tsx

export default Home;
