import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DiskModals from "../modal/disk/DiskModals";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import DiskActionButtons from "./DiskActionButtons";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import useSearch from "../button/useSearch"; // ✅ 검색 기능 추가
import { status2Icon } from "../icons/RutilVmIcons";
import SelectedIdView from "../common/SelectedIdView";
import { checkZeroSizeToGiB } from "../../util";
import Logger from "../../utils/Logger";
import { useCdromsDisks } from "../../api/RQHook";


const DiskDupl = ({
  disks = [], columns = [], type = "disk", 
  showSearchBox = true,
  refetch,
  isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDisks, setSelectedDisks] = useState([]);
  
  const diskIds = disks.map((d) => d.id);
  const { data: cdromsMap = [] } = useCdromsDisks(diskIds);
  
  // ✅ 데이터 변환: 검색이 가능하도록 `searchText` 추가
  const transformedData = disks.map((d) => {
    const cdromObj = cdromsMap.find((item) => item.diskId === d.id);
    let diskData = {
      ...d,
      _alias: (
        <TableRowClick type="disk" id={d?.id}>
          {d?.alias || d?.diskImageVo?.alias}
        </TableRowClick>
      ),
      icon: status2Icon(d.status),
      storageDomain: (
        <TableRowClick type="domain" id={d?.storageDomainVo?.id}>
          {d?.storageDomainVo?.name}
        </TableRowClick>
      ),
      sharable: d?.sharable ? "O" : "",
      icon1: d?.bootable ? "🔑" : "",
      icon2: d?.readOnly ? "🔒" : "",
      sparse: d?.sparse ? "씬 프로비저닝" : "사전 할당",
      connect: (
        <div>
        <TableRowClick
          type={d?.connectVm?.id ? "vm" : "template"}
          id={d?.connectVm?.id || d?.connectTemplate?.id}
        >
          {d?.connectVm?.name || d?.connectTemplate?.name}
        </TableRowClick>
        <span>{(cdromObj?.cdroms || []).map((cd) => cd.name).join(', ')}</span>
        </div>
      ),
      virtualSize: checkZeroSizeToGiB(d?.virtualSize),
      actualSize: checkZeroSizeToGiB(d?.actualSize),
    };

    // ✅ 검색 필드 추가 (모든 데이터를 하나의 문자열로 만듦)
    diskData.searchText = `${diskData.alias} ${diskData.sparse} ${diskData.virtualSize} ${diskData.actualSize}`;
    return diskData;
  });

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`DiskDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {/* 검색창 추가 */}
        {showSearchBox && (
          <SearchBox 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onRefresh={handleRefresh}
          />
        )}

        <DiskActionButtons
          openModal={openModal}
          isEditDisabled={selectedDisks.length !== 1}
          isDeleteDisabled={selectedDisks.length === 0}
          status={selectedDisks[0]?.status}
        />
      </div>
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        data={filteredData} // ✅ 검색된 데이터만 표시
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        // clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        columns={columns}
        onContextMenuItems={(row) => [
          <DiskActionButtons
            openModal={openModal}
            status={row?.status}
            selectedDisks={[row]}
            actionType="context"
          />,
        ]}
      />

      <SelectedIdView items={selectedDisks} />

      <DiskModals
        activeModal={activeModal}
        selectedDisks={selectedDisks}
        disk={activeModal === "edit" ? selectedDisks[0] : null}
        onClose={closeModal}
      />
    </div>
  );
};

export default DiskDupl;
