(this["webpackJsonpaccountabil-eth-y"]=this["webpackJsonpaccountabil-eth-y"]||[]).push([[0],{237:function(e,t){},239:function(e,t){},243:function(e,t){},244:function(e,t){},271:function(e,t){},273:function(e,t){},284:function(e,t){},286:function(e,t){},296:function(e,t){},298:function(e,t){},314:function(e,t){},348:function(e,t){},349:function(e,t){},419:function(e,t){},421:function(e,t){},426:function(e,t){},428:function(e,t){},435:function(e,t){},447:function(e,t){},450:function(e,t){},455:function(e,t){},531:function(e,t,n){},538:function(e,t,n){"use strict";n.r(t);var c=n(2),a=n(214),i=n.n(a),r=n(9),s=n(66),o=n(14),u=n(18),d=n.n(u),l=n(117),j=n.n(l),b=new j.a(j.a.givenProvider),h=(new b.eth.Contract([{inputs:[{internalType:"address",name:"deployed_contract",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"",type:"address"}],name:"log",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"contract_address",type:"address"}],name:"newContractCreated",type:"event"},{inputs:[],name:"contracts_deployed",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function",constant:!0},{inputs:[],name:"createContract",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"findMyContracts",outputs:[{internalType:"address[]",name:"",type:"address[]"}],stateMutability:"view",type:"function",constant:!0}],Object({NODE_ENV:"production",PUBLIC_URL:"/blockchain-developer-bootcamp-final-project/start",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).ACCOUNTABILITY_CHECKER_FACTORY_ADDRESS),n(1)),O=Object(c.createContext)(),m=function(e){var t=e.children,n=Object(c.useState)(),a=Object(o.a)(n,2),i=a[0],r=a[1];Object(c.useEffect)((function(){var e=localStorage.getItem("currentUser");r(e||null)}),[]);var u=function(){var e=Object(s.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.ethereum.request({method:"eth_requestAccounts"});case 2:(t=e.sent)&&(r(t[0]),localStorage.setItem("currentUser",t[0]));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),l=function(){var e=Object(s.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r(null);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(h.jsx)(O.Provider,{value:{user:i,getAccount:u,forgetAccount:l},children:t})};var p=function(){var e=Object(c.useContext)(O),t=e.user,n=e.getAccount,a=e.forgetAccount;return Object(h.jsxs)("div",{children:[Object(h.jsxs)("header",{children:[Object(h.jsx)("h1",{children:"Accountabil-ETH-y \ud83e\udd1e\ud83c\udffe"}),Object(h.jsxs)("div",{className:"account-data",children:[Object(h.jsxs)("div",{children:["user:",t?Object(h.jsxs)("div",{children:[t," ",Object(h.jsx)("button",{onClick:a,children:"Log Out"})]}):Object(h.jsx)("button",{onClick:n,children:"Connect your account!"})]}),Object(h.jsxs)("div",{children:["load contract:",Object(h.jsxs)("select",{name:"contracts",id:"contracts",children:[Object(h.jsx)("option",{value:"volvo",children:"Account 1"}),Object(h.jsx)("option",{value:"saab",children:"Account 2"})]})]})]})]}),Object(h.jsx)("div",{children:Object(h.jsx)(r.a,{})})]})};var x=function(){return Object(h.jsxs)("div",{children:["Click here to cash out and close your promise!",Object(h.jsx)("button",{children:"Request"})]})},f=n(81),y=n(56),v=function(e){return(Math.round(100*e)/100).toFixed(2)};var g=function(e){var t=e.amount,n=Object(c.useState)(),a=Object(o.a)(n,2),i=a[0],r=a[1],u=Number(t);return Object(c.useEffect)((function(){function e(){return(e=Object(s.a)(d.a.mark((function e(){var t,n,c,a,i,s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH");case 2:return t=e.sent,e.next=5,t.json();case 5:n=e.sent,c=n.data.rates,a=c.GBP,i=c.USD,s=c.EUR,r({GBP:a,USD:i,EUR:s});case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}!function(){e.apply(this,arguments)}()})),Object(h.jsx)("div",{children:i&&u>=0?Object(h.jsxs)("details",{children:[Object(h.jsx)("summary",{children:"See the exchange rate to Fiat currencies"}),Object(h.jsxs)("div",{children:["This amount is approximately equivalent to...",Object(h.jsxs)("div",{children:["GBP(\xa3):",v(t*i.GBP)," "]}),Object(h.jsxs)("div",{children:["USD($):",v(t*i.USD)," "]}),Object(h.jsxs)("div",{children:["EUR($): ",v(t*i.EUR)]})]})]}):Object(h.jsx)("p",{children:"Please enter a valid amount of ETH to begin \ud83e\udd37\ud83d\udcb8"})})},C=n(83),A=n.n(C),D=n(530);A.a.extend(D);var S=function(){for(var e=[],t=0;t<30;t++)e.push(Object(h.jsx)("option",{value:t+1,children:t+1},"day"+t));return e};var w=function(e){var t=e.handleSubmitForm,n=e.handleUpdateData,a=e.userPromiseData,i=Object(c.useState)({timeNow:A()().format("LL"),calculatedDeadline:void 0}),r=Object(o.a)(i,2),s=r[0],u=r[1];return Object(c.useEffect)((function(){a&&a.deadlineAsDaysAway&&u(Object(y.a)(Object(y.a)({},s),{},{calculatedDeadline:A()().add(a.deadlineAsDaysAway,"day").format("LL")}))}),[a]),Object(h.jsx)("div",{children:Object(h.jsxs)("form",{onSubmit:t,children:[Object(h.jsxs)("label",{children:["Commitments",a.userCommitments.map((function(e,t){return Object(h.jsx)("input",{type:"text",value:e,onChange:function(e){var c=a.userCommitments;c.splice(t,1,e.target.value),n(c,"userCommitments")}},"commit".concat(t))}))]}),Object(h.jsxs)("label",{children:["Deadline",Object(h.jsxs)("div",{children:[" Today is: ",s.timeNow]}),Object(h.jsx)("select",{id:"selectNumber",value:a.deadlineAsDaysAway,onChange:function(e){var t=Number(e.target.value);t&&n(t,"deadlineAsDaysAway")},children:S()}),"Your Deadline is:",s.calculatedDeadline]}),Object(h.jsxs)("label",{children:[Object(h.jsxs)("label",{children:["Wager(ETH): This is equivalent to"," ",Object(h.jsx)("input",{type:"number",value:a.dailyWager,required:!0,min:0,step:1e-4,onChange:function(e){return n(e.target.value,"dailyWager")}})," ",Object(h.jsx)(g,{amount:a.dailyWager})]}),Object(h.jsxs)("div",{children:["Total Pledge Pot:",Object(h.jsxs)("div",{children:[a.dailyWager?"".concat(a.dailyWager,"ETH "):"please set an amount ","x ",a.deadlineAsDaysAway," day(s) =",Number(a.dailyWager*a.deadlineAsDaysAway)?" ".concat(a.dailyWager*a.deadlineAsDaysAway," ETH"):Object(h.jsx)("p",{children:"Please fill out the missing info to get this total"})]}),Object(h.jsx)(g,{amount:a.dailyWager*a.deadlineAsDaysAway})]})]}),Object(h.jsx)("input",{type:"submit"})]})})},T=function(){var e=Object(c.useState)({userCommitments:["","",""],deadlineAsDaysAway:1,dailyWager:0}),t=Object(o.a)(e,2),n=t[0],a=t[1];return Object(h.jsx)(w,{userPromiseData:n,handleSubmitForm:function(e){e.preventDefault(),console.log(n)},handleUpdateData:function(e,t){a(Object(y.a)(Object(y.a)({},n),{},Object(f.a)({},t,e)))}})};var E=function(){return Object(h.jsxs)("div",{children:["Click to create your and deploy your Accountabil-ETH-y Smart Contract",Object(h.jsx)("button",{children:"Request"})]})},P=n(32);var k=function(){return Object(h.jsxs)("div",{children:["What do you want to do?",Object(h.jsx)("div",{children:Object(h.jsx)(P.b,{to:"/create-contract","aria-disabled":!0,children:"Create"})}),"or",Object(h.jsxs)("div",{children:[Object(h.jsx)("i",{children:" Connect a Accountability Checker contract to access these"}),Object(h.jsx)(P.b,{to:"/my-promise/create",children:"Create Your Promise"}),Object(h.jsx)(P.b,{to:"/my-promise/nominate",children:"Nominate an Address"}),Object(h.jsx)(P.b,{to:"/my-promise/check-in",children:" Daily Check In"}),Object(h.jsx)(P.b,{to:"/my-promise/cashout",children:"Cashout Promise"})]})]})};var _=function(){var e=Object(c.useState)(),t=Object(o.a)(e,2),n=t[0],a=t[1];return Object(h.jsxs)("form",{onSubmit:function(e){e.preventDefault(),console.log(n)},children:[Object(h.jsxs)("label",{children:["Set your new nominee to recieve your penalty pot",Object(h.jsx)("input",{type:"text",name:"newNominee",required:!0,onChange:function(e){return a(e.target.value)}})]}),Object(h.jsx)("input",{type:"submit"})]})};var U=function(){var e=Object(c.useState)(new Array(3).fill(!1)),t=Object(o.a)(e,2),n=t[0],a=t[1];return Object(h.jsxs)("div",{children:[Object(h.jsx)("h1",{children:" Submit Check"}),Object(h.jsx)("div",{children:"Dates + Other info"}),Object(h.jsxs)("form",{onSubmit:function(e){e.preventDefault();var t=n.every((function(e){return e}));console.log(n,t)},children:[["Promise1","Promise2","Promise3"].map((function(e,t){return Object(h.jsxs)("span",{children:[Object(h.jsx)("input",{type:"checkbox",id:e,value:!0,onChange:function(e){return function(e,t){var c=n;c.splice(t,1,e),a(c)}(e.target.checked,t)}}),Object(h.jsxs)("label",{for:e,children:[" ",e]})]},"commitment".concat(t+1))})),Object(h.jsx)("input",{type:"submit"})]})]})};n(531);var W=function(){return Object(h.jsx)(m,{children:Object(h.jsxs)(r.d,{children:[Object(h.jsxs)(r.b,{path:"/",element:Object(h.jsx)(p,{}),children:[Object(h.jsx)(r.b,{index:!0,path:"start",element:Object(h.jsx)(k,{})}),Object(h.jsx)(r.b,{index:!0,path:"create-contract",element:Object(h.jsx)(E,{})}),Object(h.jsxs)(r.b,{path:"my-promise",children:[Object(h.jsx)(r.b,{path:"create",element:Object(h.jsx)(T,{})}),Object(h.jsx)(r.b,{path:"nominate",element:Object(h.jsx)(_,{})}),Object(h.jsx)(r.b,{path:"check-in",element:Object(h.jsx)(U,{})}),Object(h.jsx)(r.b,{path:"cashout",element:Object(h.jsx)(x,{})})]})]}),Object(h.jsx)(r.b,{path:"*",element:Object(h.jsx)("main",{style:{padding:"1rem"},children:Object(h.jsx)("p",{children:"404 not found"})})})]})})},R=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,542)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,i=t.getLCP,r=t.getTTFB;n(e),c(e),a(e),i(e),r(e)}))};n(532);i.a.render(Object(h.jsx)(P.a,{children:Object(h.jsx)(W,{})}),document.getElementById("root")),R()}},[[538,1,2]]]);
//# sourceMappingURL=main.dab35421.chunk.js.map