import { BcryptAdapter } from '@/config';
//todo: propiedad users: Users[] en tasks.
//todo: propiedad users: Users[] en Board.
//todo: propiedad admin: Users en Board.

export const seedData = {
	users: [
		{
			_id: '65fb34bafd3f5c84bc4b1ed4',
			name: 'User 1',
			lastname: 'lastName 1',
			email: 'test1@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1ed5',
			name: 'User 2',
			lastname: 'lastName 2',
			email: 'test2@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1ed6',
			name: 'User 3',
			lastname: 'lastName 3',
			email: 'test3@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1ed7',
			name: 'User 4',
			lastname: 'lastName 4',
			email: 'test4@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1ed8',
			name: 'User 5',
			lastname: 'lastName 5',
			email: 'test5@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1ed9',
			name: 'User 6',
			lastname: 'lastName 6',
			email: 'test6@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1eda',
			name: 'User 7',
			lastname: 'lastName 7',
			email: 'test7@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1edb',
			name: 'User 8',
			lastname: 'lastName 8',
			email: 'test8@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1edc',
			name: 'User 9',
			lastname: 'lastName 9',
			email: 'test9@google.com',
			password: BcryptAdapter.hash('123456'),
		},
		{
			_id: '65fb34bafd3f5c84bc4b1edd',
			name: 'User 10',
			lastname: 'lastName10',
			email: 'test10@google.com',
			password: BcryptAdapter.hash('123456'),
		},
	],
	boards: [
		{
			name: 'Platform Launch',
			columns: [
				{
					name: 'Todo',
					tasks: [
						{
							title: 'Build UI for onboarding flow',
							description: '',
							subtasks: [
								{
									title: 'Sign up page',
									isCompleted: true,
								},
								{
									title: 'Sign in page',
									isCompleted: false,
								},
								{
									title: 'Welcome page',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed4' }, { _id: '65fb34bafd3f5c84bc4b1ed5' }],
							status: 'Todo',
						},
						{
							title: 'Build UI for search',
							description: '',
							subtasks: [
								{
									title: 'Search page',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed7' }, { _id: '65fb34bafd3f5c84bc4b1ed6' }],
							status: 'Todo',
						},
						{
							title: 'Build settings UI',
							description: '',

							subtasks: [
								{
									title: 'Account page',
									isCompleted: false,
								},
								{
									title: 'Billing page',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed5' }],
							status: 'Todo',
						},
						{
							title: 'QA and test all major user journeys',
							description:
								'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',

							subtasks: [
								{
									title: 'Internal testing',
									isCompleted: false,
								},
								{
									title: 'External testing',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed4' }, { _id: '65fb34bafd3f5c84bc4b1ed7' }],
							status: 'Todo',
						},
					],
				},
				{
					name: 'Doing',
					tasks: [
						{
							title: 'Design settings and search pages',
							description: '',
							subtasks: [
								{
									title: 'Settings - Account page',
									isCompleted: true,
								},
								{
									title: 'Settings - Billing page',
									isCompleted: true,
								},
								{
									title: 'Search page',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed8' }, { _id: '65fb34bafd3f5c84bc4b1ed6' }],
							status: 'Doing',
						},
						{
							title: 'Add account management endpoints',
							description: '',

							subtasks: [
								{
									title: 'Upgrade plan',
									isCompleted: true,
								},
								{
									title: 'Cancel plan',
									isCompleted: true,
								},
								{
									title: 'Update payment method',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed5' }, { _id: '65fb34bafd3f5c84bc4b1ed9' }],
							status: 'Doing',
						},
						{
							title: 'Design onboarding flow',
							description: '',

							subtasks: [
								{
									title: 'Sign up page',
									isCompleted: true,
								},
								{
									title: 'Sign in page',
									isCompleted: false,
								},
								{
									title: 'Welcome page',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed4' }, { _id: '65fb34bafd3f5c84bc4b1ed8' }],
							status: 'Doing',
						},
						{
							title: 'Add search enpoints',
							description: '',
							subtasks: [
								{
									title: 'Add search endpoint',
									isCompleted: true,
								},
								{
									title: 'Define search filters',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed4' }, { _id: '65fb34bafd3f5c84bc4b1ed8' }],
							status: 'Doing',
						},
						{
							title: 'Add authentication endpoints',
							description: '',

							subtasks: [
								{
									title: 'Define user model',
									isCompleted: true,
								},
								{
									title: 'Add auth endpoints',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed6' }],
							status: 'Doing',
						},
						{
							title: 'Research pricing points of various competitors and trial different business models',
							description:
								"We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",

							subtasks: [
								{
									title: 'Research competitor pricing and business models',
									isCompleted: true,
								},
								{
									title: 'Outline a business model that works for our solution',
									isCompleted: false,
								},
								{
									title: 'Talk to potential customers about our proposed solution and ask for fair price expectancy',
									isCompleted: false,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed7' }],
							status: 'Doing',
						},
					],
				},
				{
					name: 'Done',
					tasks: [
						{
							title: 'Conduct 5 wireframe tests',
							description: 'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
							subtasks: [
								{
									title: 'Complete 5 wireframe prototype tests',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed4' }, { _id: '65fb34bafd3f5c84bc4b1ed8' }],
							status: 'Done',
						},
						{
							title: 'Create wireframe prototype',
							description: 'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',

							subtasks: [
								{
									title: 'Create clickable wireframe prototype in Balsamiq',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed6' }, { _id: '65fb34bafd3f5c84bc4b1ed7' }],
							status: 'Done',
						},
						{
							title: 'Review results of usability tests and iterate',
							description: "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
							subtasks: [
								{
									title: 'Meet to review notes from previous tests and plan changes',
									isCompleted: true,
								},
								{
									title: 'Make changes to paper prototypes',
									isCompleted: true,
								},
								{
									title: 'Conduct 5 usability tests',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed3' }],
							status: 'Done',
						},
						{
							title: 'Create paper prototypes and conduct 10 usability tests with potential customers',
							description: '',

							subtasks: [
								{
									title: 'Create paper prototypes for version one',
									isCompleted: true,
								},
								{
									title: 'Complete 10 usability tests',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed8' }],
							status: 'Done',
						},
						{
							title: 'Market discovery',
							description:
								'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.',

							subtasks: [
								{
									title: 'Interview 10 prospective customers',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed5' }],
							status: 'Done',
						},
						{
							title: 'Competitor analysis',
							description: '',

							subtasks: [
								{
									title: 'Find direct and indirect competitors',
									isCompleted: true,
								},
								{
									title: 'SWOT analysis for each competitor',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed9' }],
							status: 'Done',
						},
						{
							title: 'Research the market',
							description:
								'We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.',

							subtasks: [
								{
									title: 'Write up research analysis',
									isCompleted: true,
								},
								{
									title: 'Calculate TAM',
									isCompleted: true,
								},
							],
							users: [{ _id: '65fb34bafd3f5c84bc4b1ed4' }, { _id: '65fb34bafd3f5c84bc4b1ed7' }],
							status: 'Done',
						},
					],
				},
			],
			//Usuario 2, Usuario 3, Usuario 4, Usuario 5, Usuario 6
			users: [
				{ _id: '65fb34bafd3f5c84bc4b1ed5' },
				{ _id: '65fb34bafd3f5c84bc4b1ed6' },
				{ _id: '65fb34bafd3f5c84bc4b1ed7' },
				{ _id: '65fb34bafd3f5c84bc4b1ed8' },
				{ _id: '65fb34bafd3f5c84bc4b1ed9' },
			],
			//Usuario 1
			admin: { _id: '65fb34bafd3f5c84bc4b1ed4' },
		},
	],
};

const otherBoards = [
	{
		name: 'Marketing Plan',
		columns: [
			{
				name: 'Todo',
				tasks: [
					{
						title: 'Plan Product Hunt launch',
						description: '',

						subtasks: [
							{
								title: 'Find hunter',
								isCompleted: false,
							},
							{
								title: 'Gather assets',
								isCompleted: false,
							},
							{
								title: 'Draft product page',
								isCompleted: false,
							},
							{
								title: 'Notify customers',
								isCompleted: false,
							},
							{
								title: 'Notify network',
								isCompleted: false,
							},
							{
								title: 'Launch!',
								isCompleted: false,
							},
						],
					},
					{
						title: 'Share on Show HN',
						description: '',

						subtasks: [
							{
								title: 'Draft out HN post',
								isCompleted: false,
							},
							{
								title: 'Get feedback and refine',
								isCompleted: false,
							},
							{
								title: 'Publish post',
								isCompleted: false,
							},
						],
					},
					{
						title: 'Write launch article to publish on multiple channels',
						description: '',

						subtasks: [
							{
								title: 'Write article',
								isCompleted: false,
							},
							{
								title: 'Publish on LinkedIn',
								isCompleted: false,
							},
							{
								title: 'Publish on Inndie Hackers',
								isCompleted: false,
							},
							{
								title: 'Publish on Medium',
								isCompleted: false,
							},
						],
					},
				],
			},
			{
				name: 'Doing',
				tasks: [],
			},
			{
				name: 'Done',
				tasks: [],
			},
		],
	},
	{
		name: 'Roadmap',
		columns: [
			{
				name: 'Now',
				tasks: [
					{
						title: 'Launch version one',
						description: '',

						subtasks: [
							{
								title: 'Launch privately to our waitlist',
								isCompleted: false,
							},
							{
								title: 'Launch publicly on PH, HN, etc.',
								isCompleted: false,
							},
						],
					},
					{
						title: 'Review early feedback and plan next steps for roadmap',
						description:
							"Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",

						subtasks: [
							{
								title: 'Interview 10 customers',
								isCompleted: false,
							},
							{
								title: 'Review common customer pain points and suggestions',
								isCompleted: false,
							},
							{
								title: 'Outline next steps for our roadmap',
								isCompleted: false,
							},
						],
					},
				],
			},
			{
				name: 'Next',
				tasks: [],
			},
			{
				name: 'Later',
				tasks: [],
			},
		],
	},
];
