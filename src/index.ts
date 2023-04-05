// import '@/index.css';
// import { store } from '@store/store';
// import {createAuthAction} from "@actions/authActions";
//
// store.dispatch(createAuthAction());

// avatar
//     :
//     "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg"
// email
//     :
//     "marcussss1@gmail.com"
// id
//     :
//     1
// nickname
//     :
//     "marcussss1"
// status
//     :
//     "marcussss1"
// username
//     :
//     "marcussss1"



import '@/index.css';
import { DumbContacts } from "@components/contacts/contacts"
import { SmartContacts } from "@containers/contacts/contacts";
import {ROOT} from "@config/config";
import {DumbCreateGroup} from "@components/create_group/create_group";
import {dataInputUI} from "@components/ui/data-input/data-input";
import {blueButtonUI} from "@components/ui/blue-button/blue-button";
import {DumbContact} from "@components/contact/contact";
import {smallEllipseIconUI} from "@components/ui/small-ellipse-icon/small-ellipse-icon";
import {SmartCreateGroup} from "@containers/create_group/create_group";
import {store} from "@store/store";

// const createGroup = new DumbCreateGroup({
//     ...
//     [
//         {
//             avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//             email:  "marcussss1@gmail.com",
//             id: 1,
//             nickname: "marcussss1",
//             status: "marcussss1",
//             username: "marcussss1",
//         },
//         {
//             avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                 email:  "marcussss1@gmail.com",
//             id: 1,
//             nickname: "marcussss1",
//             status: "marcussss1",
//             username: "marcussss1"
//         },
//         {
//             avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//             email:  "marcussss1@gmail.com",
//             id: 1,
//             nickname: "marcussss1",
//             status: "marcussss1",
//             username: "marcussss1"
//         },
//         {
//             avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//             email:  "marcussss1@gmail.com",
//             id: 1,
//             nickname: "marcussss1",
//             status: "marcussss1",
//             username: "marcussss1"
//         },
//     ]
// })

// const crtGroup = new SmartCreateGroup({...
//             [
//                 {
//                     avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                     email:  "marcussss1@gmail.com",
//                     id: 1,
//                     nickname: "marcussss1",
//                     status: "marcussss1",
//                     username: "marcussss1",
//                 },
//                 {
//                     avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                     email:  "marcussss1@gmail.com",
//                     id: 1,
//                     nickname: "marcussss1",
//                     status: "marcussss1",
//                     username: "marcussss1"
//                 },
//                 {
//                     avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                     email:  "marcussss1@gmail.com",
//                     id: 1,
//                     nickname: "marcussss1",
//                     status: "marcussss1",
//                     username: "marcussss1"
//                 },
//                 {
//                     avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                     email:  "marcussss1@gmail.com",
//                     id: 1,
//                     nickname: "marcussss1",
//                     status: "marcussss1",
//                     username: "marcussss1"
//                 },
//             ]
//         })
const createGroup = new
// const crtGroup = new SmartCreateGroup({
//     ...
//         [
//             {
//                 avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                 email:  "marcussss1@gmail.com",
//                 id: 1,
//                 nickname: "marcussss1",
//                 status: "marcussss1",
//                 username: "marcussss1",
//             },
//             {
//                 avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                 email:  "marcussss1@gmail.com",
//                 id: 1,
//                 nickname: "marcussss1",
//                 status: "marcussss1",
//                 username: "marcussss1"
//             },
//             {
//                 avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                 email:  "marcussss1@gmail.com",
//                 id: 1,
//                 nickname: "marcussss1",
//                 status: "marcussss1",
//                 username: "marcussss1"
//             },
//             {
//                 avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//                 email:  "marcussss1@gmail.com",
//                 id: 1,
//                 nickname: "marcussss1",
//                 status: "marcussss1",
//                 username: "marcussss1"
//             },
//         ],
//     rootNode: ROOT,
//     // rootNode: ROOT,
//     // ...
//     // [
//     //     {
//     //         avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//     //         email:  "marcussss1@gmail.com",
//     //         id: 1,
//     //         nickname: "marcussss1",
//     //         status: "marcussss1",
//     //         username: "marcussss1",
//     //     },
//     //     {
//     //         avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//     //         email:  "marcussss1@gmail.com",
//     //         id: 1,
//     //         nickname: "marcussss1",
//     //         status: "marcussss1",
//     //         username: "marcussss1"
//     //     },
//     //     {
//     //         avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//     //         email:  "marcussss1@gmail.com",
//     //         id: 1,
//     //         nickname: "marcussss1",
//     //         status: "marcussss1",
//     //         username: "marcussss1"
//     //     },
//     //     {
//     //         avatar: "https://oir.mobi/uploads/posts/2021-04/1619691521_16-oir_mobi-p-bolshaya-obezyana-zhivotnie-krasivo-foto-17.jpg",
//     //         email:  "marcussss1@gmail.com",
//     //         id: 1,
//     //         nickname: "marcussss1",
//     //         status: "marcussss1",
//     //         username: "marcussss1"
//     //     },
//     // ]
// })
//
// document.querySelector('#root')?.innerHTML = crtGroup.render()
