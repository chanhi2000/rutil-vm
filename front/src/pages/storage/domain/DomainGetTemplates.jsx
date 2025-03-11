import React, { useState } from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DomainGetVmTemplateModal from "../../../components/modal/domain/DomainGetVmTemplateModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useAllUnregisteredTemplateFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToMB } from "../../../util";
import SearchBox from "../../../components/button/SearchBox";
import useSearch from "../../../components/button/useSearch";

/**
 * @name DomainGetTemplates
 * @description 도메인으로 탬플릿 가져오기
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGetTemplates
 */
const DomainGetTemplates = ({ domainId }) => {
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
  } = useAllUnregisteredTemplateFromDomain(domainId, (e) => ({
    ...e,
  }));

  const [activeModal, setActiveModal] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]); // 다중 선택된 데이터센터
  const selectedIds = (
    Array.isArray(selectedTemplates) ? selectedTemplates : []
  )
    .map((t) => t.id)
    .join(", ");

  const transformedData = templates.map((t) => ({
    ...t,
    name: t.name,
    memory: checkZeroSizeToMB(t.memorySize),
    cpu: t.cpuTopologyCnt,
    cpuArc: t.cpuArc,
    disk: t.disk,
    createdAt: t.creationTime,
    exportedAt: t.exportedAt,
    // ✅ 검색 필드 추가
    searchText: `${t.name} ${checkZeroSizeToMB(t.memorySize)} ${t.cpuTopologyCnt} ${t.cpuArc} ${t.disk} ${t.creationTime} ${t.exportedAt}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  return (
    <>
      <div className="dupl-header-group">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="header-right-btns">
          <button onClick={() => setActiveModal("get")}>가져오기</button>
          <button onClick={() => setActiveModal("delete")}>삭제</button>
        </div>
      </div>
      <span>ID: {selectedIds || ""}</span>

      <TablesOuter
        isLoading={isTemplatesLoading}
        isError={isTemplatesError}
        isSuccess={isTemplatesSuccess}
        columns={TableColumnsInfo.GET_VMS_TEMPLATES}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedTemplates(selectedRows)}
        multiSelect={true}
      />

      {/* 가상머신 가져오기 모달 */}
      {activeModal === "get" && (
        <DomainGetVmTemplateModal
          isOpen={true}
          data={selectedTemplates}
          type="template"
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "delete" && (
        <DeleteModal
          isOpen={true}
          type="DataCenter"
          onRequestClose={() => setActiveModal(null)}
          contentLabel={"템플릿"}
          data={selectedTemplates}
        />
      )}
    </>
  );
};

export default DomainGetTemplates;
