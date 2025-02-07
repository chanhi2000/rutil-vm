// import React, { useState, useRef, useEffect } from 'react';
// import Modal from 'react-modal';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowCircleDown, faArrowCircleUp, faArrowsAltH, faBan, faCheck, faCircle, faCrown, faDesktop, faExclamationTriangle, faFan, faNetworkWired, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { useHost, useNetworkFromCluster } from '../../../../api/RQHook';
// import HostPlusModal from './NetworkHostPlusModal';
// import NetworkHostPlusModal from './NetworkHostPlusModal';
// import NewBondingModal from './NewBondingModal';
// import '../css/MNetwork.css';

// const NetworkHostModal = ({ isOpen, onRequestClose, nicData,hostId }) => {
//     // State for managing the second modal
//     const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
//     const openSecondModal = () => setIsSecondModalOpen(true);
//     const closeSecondModal = () => setIsSecondModalOpen(false);

//     // 호스트상세정보 조회로 클러스터id뽑기기
//     const { 
//       data: host
//     } = useHost(hostId);
//     // 클러스터id로 네트워크정보조회
//     const { 
//       data: network, 
//     } = useNetworkFromCluster(host?.clusterVo?.id, (network) => {
//     return {
//         id: network?.id ?? '', 
//         name: network?.name ?? 'Unknown',            
//         status: network?.status ?? '',       
//         role: network?.role ? <FontAwesomeIcon icon={faCrown} fixedWidth/> : '', 
//         description: network?.description ?? 'No description', 
//       };
//     });

//     const dragItem = useRef();
//     const dragOverItem = useRef();
//     const [items, setItems] = useState([
//         { id: '1', name: 'Network 1' },
//         { id: '2', name: 'Network 2' },
//         { id: '3', name: 'Network 3' },
//     ]);

//     const dragStart = (e, position) => {
//         dragItem.current = position;
//     };

//     const dragEnter = (e, position) => {
//         dragOverItem.current = position;
//     };
//     useEffect(() => {
//       if (network) {
//           console.log("클러스터에대한 네트워크 정보:", network);
//       }
//   }, [network]);

//     const drop = () => {
//         const newItems = [...items];
//         const dragItemContent = newItems[dragItem.current];
//         newItems.splice(dragItem.current, 1);
//         newItems.splice(dragOverItem.current, 0, dragItemContent);
//         dragItem.current = null;
//         dragOverItem.current = null;
//         setItems(newItems);
//     };
//     const [isBondingModalOpen, setIsBondingModalOpen] = useState(false);
//     const [bondingMode, setBondingMode] = useState('edit'); // 기본 모드는 'edit'
    
//     const openBondingModal = (mode = 'edit') => {
//         setBondingMode(mode);
//         setIsBondingModalOpen(true);
//     };
    
//     const closeBondingModal = () => setIsBondingModalOpen(false);
//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onRequestClose}
//             contentLabel="호스트 네트워크 설정"
//             className="Modal"
//             overlayClassName="Overlay"
//             shouldCloseOnOverlayClick={false}
//         >
//             <div className="vnic-new-content-popup">
//                 <div className="popup-header">
//                     <h1>호스트 네트워크 설정</h1>
//                     <button onClick={onRequestClose}>
//                         <FontAwesomeIcon icon={faTimes} fixedWidth />
//                     </button>
//                 </div>

//                 <div className="host_network_outer px-1.5 text-sm">
//                     <div className="py-2 font-bold underline">드래그 하여 변경</div>

//                     <div className="host-network-separation">
//                         <div className="network-separation-left">
//                             <div>
//                                 <div>인터페이스</div>
//                                 <div>할당된 논리 네트워크</div>
//                             </div>
//                             {Array.isArray(nicData) ? (
//                                 nicData.map((nic, index) => (
//                                     <div key={nic.id || index} className="separation-left-content">
//                                         <div className="interface">
//                                             {nic.bondingVo?.slaves?.length > 0 ? (
//                                                 <>
//                                                     <div className="bond-title flex gap-4">
//                                                         Bond {index + 1}
//                                                         <div>
//                                                             <FontAwesomeIcon
//                                                                 icon={faPencilAlt}
//                                                                 onClick={() => openBondingModal('edit')} // 편집 모드로 모달 열기
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                     {nic.bondingVo.slaves.map((slave, idx) => (
//                                                         <div
//                                                             className="container gap-1"
//                                                             key={idx}
//                                                             draggable
//                                                             onDragStart={(e) => dragStart(e, idx)}
//                                                             onDragEnter={(e) => dragEnter(e, idx)}
//                                                             onDragEnd={drop}
//                                                             onDragOver={(e) => e.preventDefault()}
//                                                         >
//                                                             <FontAwesomeIcon
//                                                                 icon={faCircle}
//                                                                 style={{ fontSize: "0.1rem", color: "#00FF00" }}
//                                                             />
//                                                             <FontAwesomeIcon icon={faDesktop} />
//                                                             <span>{slave.name || "슬레이브 이름 없음"}</span>
//                                                         </div>
//                                                     ))}
//                                                 </>
//                                             ) : (
//                                                 <div
//                                                     className="container gap-1"
//                                                     draggable
//                                                     onDragStart={(e) => dragStart(e, index)}
//                                                     onDragEnter={(e) => dragEnter(e, index)}
//                                                     onDragEnd={drop}
//                                                     onDragOver={(e) => e.preventDefault()}
//                                                 >
//                                                     <FontAwesomeIcon
//                                                         icon={faCircle}
//                                                         style={{ fontSize: "0.1rem", color: "#00FF00" }}
//                                                     />
//                                                     <FontAwesomeIcon icon={faDesktop} />
//                                                     <span>{nic.name || "NIC 이름 없음"}</span>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className="flex items-center justify-center">
//                                             <FontAwesomeIcon
//                                                 icon={faArrowsAltH}
//                                                 style={{ color: "grey", width: "5vw", fontSize: "0.6rem" }}
//                                             />
//                                         </div>

//                                         <div className="assigned-network-outer">
//                                             <div className="assigned-network">
//                                                 <div className="left-section">
//                                                     {nic.networkVo?.name ? (
//                                                         <>
//                                                             <FontAwesomeIcon icon={faCheck} className="icon green-icon" />
//                                                             <span className="text">{nic.networkVo.name}</span>
//                                                         </>
//                                                     ) : (
//                                                         <span className="text">할당된 네트워크가 없음</span>
//                                                     )}
//                                                 </div>
//                                                 {nic.networkVo?.name && (
//                                                     <div className="right-section">
//                                                         <FontAwesomeIcon icon={faFan} className="icon" />
//                                                         <FontAwesomeIcon icon={faDesktop} className="icon" />
//                                                         <FontAwesomeIcon icon={faDesktop} className="icon" />
//                                                         <FontAwesomeIcon icon={faBan} className="icon" />
//                                                         <FontAwesomeIcon
//                                                             icon={faExclamationTriangle}
//                                                             className="icon"
//                                                         />
//                                                         <FontAwesomeIcon
//                                                             icon={faPencilAlt}
//                                                             className="icon"
//                                                             onClick={openSecondModal}
//                                                         />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div>데이터 없음</div>
//                             )}
//                         </div>

//                         <div className="network_separation_right">
//     {network && Array.isArray(network) ? (
//         network
//             .filter(
//                 (net) =>
//                     !nicData.some(
//                         (nic) => nic.networkVo?.id === net.id
//                     )
//             )
//             .map((net, idx) => (
//                 <div
//                     key={net.id || idx}
//                     draggable
//                     onDragStart={(e) => dragStart(e, idx)}
//                     onDragEnter={(e) => dragEnter(e, idx)}
//                     onDragEnd={drop}
//                     onDragOver={(e) => e.preventDefault()}
//                     style={{
//                         padding: "15px",
//                         marginBottom: "10px",
//                         backgroundColor: "lightblue",
//                         border: "1px solid #ddd",
//                         borderRadius: "5px",
//                         textAlign: "center",
//                         fontSize: "16px",
//                         cursor: "pointer",
//                     }}
//                 >
//                     <FontAwesomeIcon
//                         icon={faNetworkWired}
//                         style={{ color: "#007bff", marginRight: "10px" }}
//                     />
//                     {net.name || "네트워크 이름 없음"}
//                 </div>
//             ))
//     ) : (
//         <div>네트워크 데이터가 없습니다</div>
//     )}
// </div>


//                     </div>
//                 </div>


//         {/*네트워크쪽 연필 추가모달 */}
//         <NetworkHostPlusModal
//           isOpen={isSecondModalOpen}
//           onClose={() => setIsSecondModalOpen(false)}
//           initialSelectedTab="ipv4"
//         />
//         {/*본딩 */}
//         <NewBondingModal
//           isOpen={isBondingModalOpen}
//           onClose={closeBondingModal}
//           mode={bondingMode}
//         />
//         <div className="edit-footer">
//           <button style={{ display: 'none' }}></button>
//           <button>OK</button>
//           <button onClick={onRequestClose}>취소</button>
//         </div>
//       </div>
//       </Modal>
// 	);
// };

// export default NetworkHostModal;



