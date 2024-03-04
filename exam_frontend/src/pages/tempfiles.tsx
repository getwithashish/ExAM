// chart styling

// const SalesChart: FC = function () {
//   const { mode } = useTheme();
//   const isDarkTheme = mode === "dark";

//   const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
//   const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
//   const opacityFrom = isDarkTheme ? 0 : 1;
//   const opacityTo = isDarkTheme ? 0 : 1;

//   const options: ApexCharts.ApexOptions = {
//     stroke: {
//       curve: "smooth",
//     },
//     chart: {
//       type: "area",
//       fontFamily: "Inter, sans-serif",
//       foreColor: labelColor,
//       toolbar: {
//         show: false,
//       },
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         opacityFrom,
//         opacityTo,
//         type: "vertical",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     tooltip: {
//       style: {
//         fontSize: "14px",
//         fontFamily: "Inter, sans-serif",
//       },
//     },
//     grid: {
//       show: true,
//       borderColor: borderColor,
//       strokeDashArray: 1,
//       padding: {
//         left: 35,
//         bottom: 15,
//       },
//     },
//     markers: {
//       size: 5,
//       strokeColors: "#ffffff",
//       hover: {
//         size: undefined,
//         sizeOffset: 3,
//       },
//     },
//     xaxis: {
//       categories: [
//         "01 Feb",
//         "02 Feb",
//         "03 Feb",
//         "04 Feb",
//         "05 Feb",
//         "06 Feb",
//         "07 Feb",
//       ],
//       labels: {
//         style: {
//           colors: [labelColor],
//           fontSize: "14px",
//           fontWeight: 500,
//         },
//       },
//       axisBorder: {
//         color: borderColor,
//       },
//       axisTicks: {
//         color: borderColor,
//       },
//       crosshairs: {
//         show: true,
//         position: "back",
//         stroke: {
//           color: borderColor,
//           width: 1,
//           dashArray: 10,
//         },
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           colors: [labelColor],
//           fontSize: "14px",
//           fontWeight: 500,
//         },
//         formatter: function (value) {
//           return "$" + value;
//         },
//       },
//     },
//     legend: {
//       fontSize: "14px",
//       fontWeight: 500,
//       fontFamily: "Inter, sans-serif",
//       labels: {
//         colors: [labelColor],
//       },
//       itemMargin: {
//         horizontal: 10,
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 1024,
//         options: {
//           xaxis: {
//             labels: {
//               show: false,
//             },
//           },
//         },
//       },
//     ],
//   };
//   const series = [
//     {
//       name: "Revenue",
//       data: [6356, 6218, 6156, 6526, 6356, 6256, 6056],
//       color: "#1A56DB",
//     },
//   ];

//   return <Chart height={420} options={options} series={series} type="area" />;
// };



// Date picker drop down

// const Datepicker: FC = function () {
//     return (
//       <span className="text-sm text-gray-600">
//         <Dropdown inline label="Last 7 days">
//           <Dropdown.Item>
//             <strong>Sep 16, 2021 - Sep 22, 2021</strong>
//           </Dropdown.Item>
//           <Dropdown.Divider />
//           <Dropdown.Item>Yesterday</Dropdown.Item>
//           <Dropdown.Item>Today</Dropdown.Item>
//           <Dropdown.Item>Last 7 days</Dropdown.Item>
//           <Dropdown.Item>Last 30 days</Dropdown.Item>
//           <Dropdown.Item>Last 90 days</Dropdown.Item>
//           <Dropdown.Divider />
//           <Dropdown.Item>Custom...</Dropdown.Item>
//         </Dropdown>
//       </span>
//     );
//   };


// const LatestCustomers: FC = function () {
//     return (
//       <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
//             Latest Customers
//           </h3>
//           <a
//             href="#"
//             className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
//           >
//             View all
//           </a>
//         </div>
//         <div className="flow-root">
//           <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//             <li className="py-3 sm:py-4">
//               <div className="flex items-center space-x-4">
//                 <div className="shrink-0">
//                   <img
//                     className="h-8 w-8 rounded-full"
//                     src="/images/users/neil-sims.png"
//                     alt=""
//                   />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                     Neil Sims
//                   </p>
//                   <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                     email@flowbite.com
//                   </p>
//                 </div>
//                 <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//                   $320
//                 </div>
//               </div>
//             </li>
//             <li className="py-3 sm:py-4">
//               <div className="flex items-center space-x-4">
//                 <div className="shrink-0">
//                   <img
//                     className="h-8 w-8 rounded-full"
//                     src="/images/users/bonnie-green.png"
//                     alt=""
//                   />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                     Bonnie Green
//                   </p>
//                   <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                     email@flowbite.com
//                   </p>
//                 </div>
//                 <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//                   $3467
//                 </div>
//               </div>
//             </li>
//             <li className="py-3 sm:py-4">
//               <div className="flex items-center space-x-4">
//                 <div className="shrink-0">
//                   <img
//                     className="h-8 w-8 rounded-full"
//                     src="/images/users/michael-gough.png"
//                     alt=""
//                   />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                     Michael Gough
//                   </p>
//                   <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                     email@flowbite.com
//                   </p>
//                 </div>
//                 <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//                   $67
//                 </div>
//               </div>
//             </li>
//             <li className="py-3 sm:py-4">
//               <div className="flex items-center space-x-4">
//                 <div className="shrink-0">
//                   <img
//                     className="h-8 w-8 rounded-full"
//                     src="/images/users/thomas-lean.png"
//                     alt=""
//                   />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                     Thomes Lean
//                   </p>
//                   <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                     email@flowbite.com
//                   </p>
//                 </div>
//                 <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//                   $2367
//                 </div>
//               </div>
//             </li>
//             <li className="py-3 sm:py-4">
//               <div className="flex items-center space-x-4">
//                 <div className="shrink-0">
//                   <img
//                     className="h-8 w-8 rounded-full"
//                     src="/images/users/lana-byrd.png"
//                     alt=""
//                   />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
//                     Lana Byrd
//                   </p>
//                   <p className="truncate text-sm text-gray-500 dark:text-gray-400">
//                     email@flowbite.com
//                   </p>
//                 </div>
//                 <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
//                   $367
//                 </div>
//               </div>
//             </li>
//           </ul>
//         </div>
//         <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
//           <Datepicker />
//           <div className="shrink-0">
//             <a
//               href="#"
//               className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
//             >
//               Sales Report
//               <svg
//                 className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   };

// const AcquisitionOverview: FC = function () {
//     return (
//       <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
//         <h3 className="mb-6 text-xl font-bold leading-none text-gray-900 dark:text-white">
//           Acquisition Overview
//         </h3>
//         <div className="flex flex-col">
//           <div className="overflow-x-auto rounded-lg">
//             <div className="inline-block min-w-full align-middle">
//               <div className="overflow-hidden shadow sm:rounded-lg">
//                 <Table className="min-w-full table-fixed">
//                   <Table.Head>
//                     <Table.HeadCell className="whitespace-nowrap rounded-l border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
//                       Top Channels
//                     </Table.HeadCell>
//                     <Table.HeadCell className="whitespace-nowrap border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
//                       Users
//                     </Table.HeadCell>
//                     <Table.HeadCell className="min-w-[140px] whitespace-nowrap rounded-r border-x-0 bg-gray-50 py-3 px-4 text-left align-middle text-xs font-semibold uppercase text-gray-700 dark:bg-gray-700 dark:text-white">
//                       Acquisition
//                     </Table.HeadCell>
//                   </Table.Head>
//                   <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
//                     <Table.Row className="text-gray-500 dark:text-gray-400">
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
//                         Organic Search
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
//                         5,649
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
//                         <div className="flex items-center">
//                           <span className="mr-2 text-xs font-medium">30%</span>
//                           <div className="relative w-full">
//                             <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
//                               <div
//                                 className="h-2 rounded-sm bg-primary-700"
//                                 style={{ width: "30%" }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row className="text-gray-500 dark:text-gray-400">
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
//                         Referral
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
//                         4,025
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
//                         <div className="flex items-center">
//                           <span className="mr-2 text-xs font-medium">24%</span>
//                           <div className="relative w-full">
//                             <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
//                               <div
//                                 className="h-2 rounded-sm bg-orange-300"
//                                 style={{ width: "24%" }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row className="text-gray-500 dark:text-gray-400">
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
//                         Direct
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
//                         3,105
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
//                         <div className="flex items-center">
//                           <span className="mr-2 text-xs font-medium">18%</span>
//                           <div className="relative w-full">
//                             <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
//                               <div
//                                 className="h-2 rounded-sm bg-teal-400"
//                                 style={{ width: "18%" }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row className="text-gray-500 dark:text-gray-400">
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
//                         Social
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
//                         1251
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
//                         <div className="flex items-center">
//                           <span className="mr-2 text-xs font-medium">12%</span>
//                           <div className="relative w-full">
//                             <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
//                               <div
//                                 className="h-2 rounded-sm bg-pink-600"
//                                 style={{ width: "12%" }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row className="text-gray-500 dark:text-gray-400">
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
//                         Other
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
//                         734
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
//                         <div className="flex items-center">
//                           <span className="mr-2 text-xs font-medium">9%</span>
//                           <div className="relative w-full">
//                             <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
//                               <div
//                                 className="h-2 rounded-sm bg-indigo-600"
//                                 style={{ width: "9%" }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                     <Table.Row className="text-gray-500 dark:text-gray-400">
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 text-left align-middle text-sm font-normal">
//                         Email
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs font-medium text-gray-900 dark:text-white">
//                         456
//                       </Table.Cell>
//                       <Table.Cell className="whitespace-nowrap border-t-0 p-4 align-middle text-xs">
//                         <div className="flex items-center">
//                           <span className="mr-2 text-xs font-medium">7%</span>
//                           <div className="relative w-full">
//                             <div className="h-2 w-full rounded-sm bg-gray-200 dark:bg-gray-700">
//                               <div
//                                 className="h-2 rounded-sm bg-purple-500"
//                                 style={{ width: "7%" }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </Table.Cell>
//                     </Table.Row>
//                   </Table.Body>
//                 </Table>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
//           <Datepicker />
//           <div className="shrink-0">
//             <a
//               href="#"
//               className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
//             >
//               Acquisition Report
//               <svg
//                 className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   };

// const Datepicker: FC = function () {
//     return (
//       <span className="text-sm text-gray-600">
//         <Dropdown inline label="Last 7 days">
//           <Dropdown.Item>
//             <strong>Sep 16, 2021 - Sep 22, 2021</strong>
//           </Dropdown.Item>
//           <Dropdown.Divider />
//           <Dropdown.Item>Yesterday</Dropdown.Item>
//           <Dropdown.Item>Today</Dropdown.Item>
//           <Dropdown.Item>Last 7 days</Dropdown.Item>
//           <Dropdown.Item>Last 30 days</Dropdown.Item>
//           <Dropdown.Item>Last 90 days</Dropdown.Item>
//           <Dropdown.Divider />
//           <Dropdown.Item>Custom...</Dropdown.Item>
//         </Dropdown>
//       </span>
//     );
//   };