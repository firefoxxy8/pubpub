/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_ATOM_LOAD = 'atomEdit/CREATE_ATOM_LOAD';
export const CREATE_ATOM_SUCCESS = 'atomEdit/CREATE_ATOM_SUCCESS';
export const CREATE_ATOM_FAIL = 'atomEdit/CREATE_ATOM_FAIL';

export const GET_ATOM_EDIT_LOAD = 'atomEdit/GET_ATOM_EDIT_LOAD';
export const GET_ATOM_EDIT_SUCCESS = 'atomEdit/GET_ATOM_EDIT_SUCCESS';
export const GET_ATOM_EDIT_FAIL = 'atomEdit/GET_ATOM_EDIT_FAIL';

export const SAVE_VERSION_LOAD = 'atomEdit/SAVE_VERSION_LOAD';
export const SAVE_VERSION_SUCCESS = 'atomEdit/SAVE_VERSION_SUCCESS';
export const SAVE_VERSION_FAIL = 'atomEdit/SAVE_VERSION_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createAtom(type) {
	return {
		types: [CREATE_ATOM_LOAD, CREATE_ATOM_SUCCESS, CREATE_ATOM_FAIL],
		promise: (client) => client.post('/createAtom', {data: {
			'type': type,
		}})
	};
}

export function getAtomEdit(slug) {
	return {
		types: [GET_ATOM_EDIT_LOAD, GET_ATOM_EDIT_SUCCESS, GET_ATOM_EDIT_FAIL],
		promise: (client) => client.get('/getAtomEdit', {params: {
			'slug': slug,
		}})
	};
}

export function saveVersion(newVersion) {
	return {
		types: [SAVE_VERSION_LOAD, SAVE_VERSION_SUCCESS, SAVE_VERSION_FAIL],
		promise: (client) => client.post('/saveVersion', {data: {
			'newVersion': newVersion,
		}})
	};
}


