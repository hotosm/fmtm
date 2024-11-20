type authDetailsType = {
	id: number;
	username: string;
	profile_img: string;
	role: string;
	project_roles: string | null;
	orgs_managed: number[];
};

let authDetails: authDetailsType | null = null;

function getLoginStore() {
	return {
		get getAuthDetails() {
			return authDetails;
		},
		setAuthDetails: (authData: authDetailsType) => {
			authDetails = authData;
		},
	};
}

export { getLoginStore };
