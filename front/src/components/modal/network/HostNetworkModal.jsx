import React, { useState, useRef, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAltH,faCrown,faDesktop,faPencilAlt,} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import HostNetworkBondingModal from "./HostNetworkBondingModal";
import HostNetworkEditModal from "./HostNetworkEditModal";
import { useHost, useNetworkFromCluster } from "../../../api/RQHook";
import "./MNetwork.css";
import Loading from "../../common/Loading";
import { renderTFStatusIcon } from "../../Icon";

const HostNetworkModal = ({ 
  isOpen, 
  onClose, 
  nicData, 
  hostId 
}) => {
  // 호스트상세정보 조회로 클러스터id 뽑기
  const { data: host } = useHost(hostId);
  
  // 클러스터id로 네트워크정보조회
  const { data: network } = useNetworkFromCluster(host?.clusterVo?.id, (network) => ({
    id: network?.id ?? "",
    name: network?.name ?? "Unknown",
    status: network?.status ?? "",
    vlan: network?.vlan,
    role: network?.usage?.vm, 
    description: network?.description ?? "No description",
  }));

  // 네트워크 인터페이스 및 Bonding 정보를 저장하는 배열
  const [outer, setOuter] = useState([]);
  
  const [isNetworkEditPopupOpen, setIsNetworkEditPopupOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const openNetworkEditPopup = (network) => {
    setSelectedNetwork(network); // 선택한 네트워크 정보 저장
    setIsNetworkEditPopupOpen(true);
  };

  const [isBondingPopupOpen, setIsBondingPopupOpen] = useState(false);
  const [selectedBonding, setSelectedBonding] = useState(null);
  const openBondingPopup = (bond) => {
    setSelectedBonding(bond); // 선택한 본딩 정보 저장
    setIsBondingPopupOpen(true);
  }; 


  // 드래그하는 요소를 추적
  const dragItem = useRef(null);  
  const dragStart = (e, item, source, parentId = null) => {
    dragItem.current = { item, source, parentId };
  };
  const drop = (targetId, targetType) => {
    if (!dragItem.current) return;
    const { item, source, parentId } = dragItem.current;
  
    if (source === "container" && targetType === "interface") {
      if (parentId === targetId) {
        alert("같은 Interface 내에서는 이동할 수 없습니다.");
        dragItem.current = null;
        return;
      }
  
      setOuter((prevOuter) => {
        let validMove = true;
        let bondRequired = false; // Bonding이 필요한 경우 플래그
  
        const updatedOuter = prevOuter.map((outerItem) => {
          if (outerItem.id === parentId) {
            if (
              outerItem.networks.length > 0 &&
              outerItem.children.length === 1
            ) {
              alert(
                "Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다."
              );
              validMove = false;
              return outerItem;
            }
            return {
              ...outerItem,
              children: outerItem.children.filter(
                (child) => child.id !== item.id
              ),
            };
          }
  
          if (outerItem.id === targetId) {
            const targetHasBond = outerItem.name.startsWith("bond"); // bond 그룹인지 확인
            const targetHasMultipleChildren = outerItem.children.length > 1; // 이미 2개 이상 container가 있는지
            const targetHasNetwork = outerItem.networks.length > 0; // 네트워크가 걸려 있는지
          
            if (targetHasBond && targetHasMultipleChildren) {
              // ✅ Bonding이 이미 있고, 여러 개의 container가 존재하면 그냥 추가
              return {
                ...outerItem,
                children: [...outerItem.children, item],
              };
            } else if (targetHasBond && !targetHasMultipleChildren && targetHasNetwork) {
              // ❌ Bond 내에 하나의 container만 있고 네트워크가 걸려 있다면 이동 불가
              alert("Container를 이동할 수 없습니다. 연결된 네트워크가 있고 container가 하나뿐입니다.");
              validMove = false;
              return outerItem;
            } else {
              // 🔹 Bonding이 없는 상태에서 단일 container끼리 합칠 때 본딩 필요
              bondRequired = true;
            }
          
            // ✅ 본딩이 필요하든 아니든, container는 무조건 추가해야 함
            return {
              ...outerItem,
              children: [...outerItem.children, item],
            };
          }
          
          return outerItem;
        });
  
        if (bondRequired) {
          openBondingPopup("create"); // Bonding 모달 띄우기
        }
  
        return validMove ? updatedOuter : prevOuter;
      });
    } else if (source === "unassigned" && targetType === "networkOuter") {
      // 네트워크를 인터페이스에 추가
      setOuter((prevOuter) =>
        prevOuter.map((outerItem) => {
          if (outerItem.id === targetId) {
            if (outerItem.networks.length > 0) {
              alert("1개의 네트워크만 걸 수 있습니다.");
              return outerItem;
            }
            return { ...outerItem, networks: [...outerItem.networks, item] };
          }
          return outerItem;
        })
      );
      setUnassignedNetworks((prev) => prev.filter((net) => net.id !== item.id));
    } else if (source === "networkOuter" && targetType === "unassigned") {
      // 네트워크를 할당 해제 (Unassigned로 이동)
      setOuter((prevOuter) =>
        prevOuter
          .map((outerItem) => {
            if (outerItem.id === parentId) {
              return {
                ...outerItem,
                networks: outerItem.networks.filter(
                  (network) => network.id !== item.id
                ),
              };
            }
            return outerItem;
          })
          .filter(
            (outerItem) =>
              outerItem.children.length > 0 || outerItem.networks.length > 0
          ) // Remove empty outer
      );
      setUnassignedNetworks((prev) => [...prev, item]); // Unassigned 리스트에 추가
    } else if (source === "networkOuter" && targetType === "networkOuter") {
      // 네트워크를 다른 인터페이스로 이동
      setOuter((prevOuter) =>
        prevOuter.map((outerItem) => {
          if (outerItem.id === parentId) {
            return {
              ...outerItem,
              networks: outerItem.networks.filter(
                (network) => network.id !== item.id
              ),
            };
          }
          if (outerItem.id === targetId) {
            if (outerItem.networks.length > 0) {
              alert("1개의 네트워크만 걸 수 있습니다.");
              return outerItem;
            }
            return {
              ...outerItem,
              networks: [...outerItem.networks, item],
            };
          }
          return outerItem;
        })
      );
    }
    dragItem.current = null; // Reset drag state
  };


  useEffect(() => {
    if (nicData && nicData.length > 0) {
      let bondCounter = 0;
      setOuter(
        nicData.map((nic) => ({
          id: nic.id || `outer${bondCounter + 1}`,
          name: nic.bondingVo?.slaves?.length > 1 ? `bond${bondCounter++}` : "",
          children: nic.bondingVo?.slaves?.length > 0
              ? nic.bondingVo.slaves.map((slave) => ({ id: slave.id, name: slave.name,})) 
              : [{ id: nic.id, name: nic.name }],
          networks: nic.networkVo?.id 
              ? [{ id: nic.networkVo.id, name: nic.networkVo.name }] 
              : [],
        }))
      );
    }
  }, [nicData]);

  // // Interfaces 생성
  // const [unassignedInterface, setUnassignedInterface] = useState(
  //   nicData?.map((nic) => ({
  //     id: nic.id,
  //     name: nic.name,
  //     children: nic.bondingVo?.slaves?.length > 0
  //         ? nic.bondingVo.slaves.map((slave) => ({ id: slave.id, name: slave.name }))
  //         : [{ id: nic.id, name: nic.name }], // slaves가 없으면 nic의 name 사용
  //   })) || []
  // );

  // // Networks in Outer 생성
  // const [unassignedNetworksOuter, setUnassignedNetworksOuter] = useState(
  //   nicData?.map((nic) => ({
  //     id: nic.networkVo?.id || `network${nic.id}`,
  //     name: nic.networkVo?.name || `Unassigned Network for ${nic.name}`,
  //     children: [],
  //   })) || []
  // );

  // Networks 설정 (기존 데이터 유지)
  const [unassignedNetworks, setUnassignedNetworks] = useState([{ id: "", name: "" },]);
  
  // 우클릭 분리 버튼을 위해서
  // const handleContextMenu = (event, targetItem, parentItem) => {
  //   event.preventDefault(); // 기본 우클릭 메뉴 차단
  //   console.log("우클릭 이벤트 발생", targetItem, parentItem);
  
  //   if (targetItem.children) {
  //     if (parentItem.children.length < 2) {
  //       console.log("⚠️ parentItem.children.length < 2 → 우클릭 메뉴 차단됨");
  //       return;
  //     }
  //   } else {
  //     if (parentItem.networks.length < 2) {
  //       console.log("⚠️ parentItem.networks.length < 2 → 우클릭 메뉴 차단됨");
  //       return;
  //     }
  //   }
  
  //   setContextMenu({
  //     x: event.clientX,
  //     y: event.clientY,
  //     containerItem: targetItem,
  //     parentInterface: parentItem,
  //   });
  //   console.log("✅ 컨텍스트 메뉴 생성됨:", { x: event.clientX, y: event.clientY });
  // };
  
  const [contextMenu, setContextMenu] = useState(null);
  const renderContextMenu = () => {
    if (!contextMenu) return null;
  
    // 화면 크기 가져오기
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    // 기본 위치
    let menuX = contextMenu.x;
    let menuY = contextMenu.y;

    // 우클릭 메뉴 크기 예상값
    const menuWidth = 120;
    const menuHeight = 40;
  
    // 화면을 넘어가면 위치 조정
    if (menuX + menuWidth > screenWidth) {
      menuX = screenWidth - menuWidth - 10;
    }
    if (menuY + menuHeight > screenHeight) {
      menuY = screenHeight - menuHeight - 10;
    }
  
    return (
      <div
        className="context-menu"
        style={{
          position: "fixed",
          top: menuY + "px",
          left: menuX + "px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "8px 12px",
          zIndex: 99999,
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
          borderRadius: "4px",
          fontSize: "14px",
          cursor: "pointer",
        }}
        onClick={handleSplitContainer}
      >
        🔹 분리
      </div>
    );
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu) {
        setTimeout(() => setContextMenu(null), 100); // 💡 100ms 지연 추가
      }
    };
  
    document.addEventListener("mouseup", handleClickOutside);
    return () => document.removeEventListener("mouseup", handleClickOutside);
  }, [contextMenu]);
  
  const handleSplitContainer = () => {
    if (!contextMenu) return;
  
    setOuter((prevOuter) => {
      return prevOuter.flatMap((outerItem) => {
        if (outerItem.id === contextMenu.parentInterface.id) {
          // 기존 인터페이스에서 선택된 컨테이너를 제외
          const updatedChildren = outerItem.children.filter(
            (child) => child.id !== contextMenu.containerItem.id
          );
  
          // 기존 인터페이스 유지
          const updatedOuterItem = { ...outerItem, children: updatedChildren };
  
          // 새로운 인터페이스 추가
          const newInterface = {
            id: contextMenu.containerItem.id,
            name: contextMenu.containerItem.name,
            children: [contextMenu.containerItem],
            networks: [],
          };
  
          return [updatedOuterItem, newInterface].filter(
            (item) => item.children.length > 0
          );
        }
        return outerItem;
      });
    });
  
    setContextMenu(null); // 우클릭 메뉴 닫기
  };
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
  
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  
  const renderInterface = (interfaceItem) => (
    <div
      key={interfaceItem.id}
      className="interface"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => drop(interfaceItem.id, "interface")}
    >
      {/* Bond 이름 표시 및 연필 아이콘 추가 */}
      {interfaceItem.name && (
        <div className="interface-header">
          {interfaceItem.name}
          {interfaceItem.name.startsWith("bond") && (
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="icon"
              onClick={() => openBondingPopup("edit")} // 편집 모드로 NewBondingModal 열기
              style={{ marginLeft: "0.2rem", cursor: "pointer" }}
            />
          )}
        </div>
      )}
      <div className="children">
        {interfaceItem.children.map((child) => (
          <div
            key={child.id}
            className="container"
            draggable
            onDragStart={(e) =>
              dragStart(e, child, "container", interfaceItem.id)
            }
            onContextMenu={(e) => handleContextMenu(e, child, interfaceItem)} 
          >
            {child.name}
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderNetworkOuter = (outerItem) => {
    if (outerItem.networks.length === 0) {
      return (
        <div
          className="outer-networks"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => drop(outerItem.id, "networkOuter")}
        >
          <div className="assigned-network">
            <div className="left-section">
              <span className="text">할당된 네트워크가 없음</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="outer-networks"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => drop(outerItem.id, "networkOuter")}
        onContextMenu={(e) => handleContextMenu(e, network, outerItem)}
      >
        {outerItem.networks.map((network) => (
          <div
            key={network.id}
            className="center"
            draggable
            onDragStart={(e) => dragStart(e, network, "networkOuter", outerItem.id)}
          >
            <div className="left-section">{network.name}</div>
            <div className="right-section">
              {/* 네트워크 설정에 관한 항목은 정리 필요 */}
              {network?.role === true ? <FontAwesomeIcon icon={faDesktop} className="icon" style={{ marginLeft: "0.2rem", cursor: "pointer" }} />: "a"}
              {/* <FontAwesomeIcon icon={faDesktop} className="icon" /> */}
              <FontAwesomeIcon
                onClick={() => openNetworkEditPopup(network)} // 네트워크 정보와 함께 모달 열기
                icon={faPencilAlt}
                className="icon"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderUnassignedNetworks = () => {
    const assignedNetworkIds = outer.flatMap((outerItem) =>
      outerItem.networks.map((net) => net.id)
    );

    const availableNetworks = network?.filter(
      (net) => !assignedNetworkIds.includes(net.id)
    );

    return availableNetworks?.map((net) => (
      <div
        key={net.id}
        className="network-item"
        draggable
        onDragStart={(e) => dragStart(e, net, "unassigned")}
      >
        <div className="flex items-center justify-center">
          {renderTFStatusIcon(net?.status==="OPERATIONAL")}{net?.name}<br/>
          {net?.vlan === 0 ? "":`(VLAN ${net?.vlan})` }
        </div>
      </div>
    ));
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"호스트 네트워크"}
      submitTitle={"설정"}
      onSubmit={() => {}}
      contentStyle={{ width: "880px", height: "620px" }} 
    >
      <div className="popup-content-outer px-2">
        <div className="py-3 font-bold underline"></div>
        <div className="host-network-separation f-btw">
          <div className="network-separation-left">
            <div className ="f-btw">
              <div>인터페이스</div>
              <div>할당된 논리 네트워크</div>
            </div>

            {outer
              .filter(outerItem => outerItem.children.length > 0 || outerItem.networks.length > 0) // container와 네트워크가 둘 다 없으면 제외
              .map((outerItem) => (
                <div key={outerItem.id} className="separation-left-content">
                  {/* Render Interface */}
                  {renderInterface(outerItem)}

                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={faArrowsAltH} style={{color: "grey", width: "5vw", fontSize: "20px", }} />
                  </div>

                  {/* Render Networks for Each Interface */}
                  <div className="assigned-network-outer">
                    <div className="outer-networks">
                      {renderNetworkOuter(outerItem)}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Unassigned Networks */}
          <div
            className="network-separation-right"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(null, "unassigned")}
          >
            {renderUnassignedNetworks()}
          </div>
        </div>
      </div>


    <Suspense fallback={<Loading/>}>
      {/* 네트워크쪽 연필 추가모달 */}
      {isNetworkEditPopupOpen && selectedNetwork && (
        <HostNetworkEditModal
          isOpen={isNetworkEditPopupOpen}
          onClose={() => setIsNetworkEditPopupOpen(false)}
          network={selectedNetwork}
        />
      )}
      {/* 본딩 */}
      {isBondingPopupOpen && selectedBonding && (
        <HostNetworkBondingModal
          isOpen={isBondingPopupOpen}
          editmode
          // bonding={}
          onClose={() => setIsBondingPopupOpen(false)}
        />
      )}
    </Suspense>

      {renderContextMenu()}
    </BaseModal>
  );
};

export default HostNetworkModal;
