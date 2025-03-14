import React, { useState } from 'react';
import TableRowClick from '../../../components/table/TableRowClick';
import { useAllDisksFromTemplate, useDomainById } from '../../../api/RQHook';
import { checkZeroSizeToGB, convertBytesToGB } from '../../../util';
import { Tooltip } from 'react-tooltip';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import TablesOuter from '../../../components/table/TablesOuter';
import DiskActionModal from '../../../components/modal/disk/DiskActionModal'

const StorageDomainWithTooltip = ({ domainId }) => {
  const { data: storageDomain, isLoading } = useDomainById(domainId);

  return (
    <>
      <span data-tooltip-id={`storage-domain-tooltip-${domainId}`}>
        <TableRowClick type="domains" id={domainId}>
          {storageDomain?.name || '불러오는 중...'}
        </TableRowClick>
      </span>
      <Tooltip id={`storage-domain-tooltip-${domainId}`} place="top" effect="solid">
        {isLoading
          ? '로딩 중...'
          : <>
              {/* {storageDomain?.name || '정보 없음'}<br /> */}
              크기: {checkZeroSizeToGB(storageDomain?.diskSize)}<br />
              사용 가능: {checkZeroSizeToGB(storageDomain?.availableSize)}<br />
              사용됨: {checkZeroSizeToGB(storageDomain?.usedSize)}<br />
            </>
        }
      </Tooltip>
    </>
  );
};


/**
 * @name TemplateDisks
 * @description 탬플릿에 종속 된 디스크 목록
 *
 * @prop {string} templateId 탬플릿 ID
 * @returns {JSX.Element} TemplateDisks
 */
const TemplateDisks = ({ templateId }) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllDisksFromTemplate(templateId, ((e) => ({...e})));
  
  const transformedData = disks?.map((e) => {
    const disk = e?.diskImageVo;
    return {
      id: e?.id,
      interfaceType: e?.interface_ || 'N/A',
      alias: disk?.alias || 'Unnamed Disk',
      virtualSize: convertBytesToGB(disk?.virtualSize) + " GB",
      actualSize: convertBytesToGB(disk?.actualSize) + " GB",
      creationTime: disk?.createDate || 'N/A',
      storageDomainId: disk?.storageDomainVo?.id,
      storageDomainName: disk?.storageDomainVo ? (
        <StorageDomainWithTooltip domainId={disk.storageDomainVo.id} />
      ) : 'N/A',
      storageType: disk?.storageType || 'Unknown',
      status: disk?.status || 'Unknown',
      policy: disk?.sparse ? '씬 프로비저닝' : '두꺼운 프로비저닝',
    };
  });

  const [selectedDisks, setSelectedDisks] = useState([]); // 선택된 디스크 ID 상태
  const [activeModal, setActiveModal] = useState(null);

  const selectedDiskIds = (Array.isArray(selectedDisks) ? selectedDisks : []).map(d => d.id).join(', ');
  console.log("a " + selectedDisks)

  return (
    <>
      <div className="header-right-btns">
        <button disabled={selectedDisks.length === 0} onClick={() => setActiveModal('copy')}>복사</button>
      </div>
      <span>id: {selectedDiskIds || ""}</span>

      <TablesOuter
        isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
        columns={TableColumnsInfo.DISKS_FROM_TEMPLATE}
        data={transformedData}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
      />
      
      {activeModal === 'copy' && (
        <DiskActionModal
          isOpen
          action="copy"
          data={selectedDisks[0]}
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
};

export default TemplateDisks;
