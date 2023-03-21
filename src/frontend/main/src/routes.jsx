import React from 'react';
import {
    createBrowserRouter,
} from "react-router-dom";
import Home from './views/Home';
import Tabbed from './views/Tabbed';
import MainView from './views/MainView';
import { Suspense } from 'react';
// import ProjectDetails from "map/ProjectDetails";

const ProjectDetails = React.lazy(() => import('map/ProjectDetails'));
const routes = createBrowserRouter(
    [
        {
            element: <MainView />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/tabbed",
                    element: <Tabbed />,
                },
                {
                    path: '/project_details/:id',
                    element: <Suspense fallback={<div></div>}>
                        <ProjectDetails />
                    </Suspense>

                    ,
                },
            ],
        },
    ]
);

export default routes;
