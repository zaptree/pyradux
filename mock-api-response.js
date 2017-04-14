'use strict';

module.exports = {
	'/api/home': {
		text: 'dynamic text that came from the server'
	},
	'/api/list': {
		items: [
			{
				id: 1,
				title: 'Item 1'
			},
			{
				id: 2,
				title: 'Item 2'
			},
			{
				id: 3,
				title: 'Item 3'
			}
		]
	},
	'/api/details/1': {
		id: 1,
		title: 'Item 1',
		text: 'This is the first item in the list'
	},
	'/api/details/2': {
		id: 2,
		title: 'Item 2',
		text: 'This is the second item in the list'
	},
	'/api/details/3': {
		id: 3,
		title: 'Item 3',
		text: 'This is the third item in the list'
	}
};
