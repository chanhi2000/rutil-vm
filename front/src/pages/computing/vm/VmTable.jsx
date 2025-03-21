import React from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import { useNavigate } from "react-router-dom";
import { renderVmStatusIcon } from "../../../components/Icon";

/**
 * @name VmTable
 * @description VM 관련 테이블 컴포넌트
 *
 * @prop {Array} vms 
 * @returns {JSX.Element} VmTable
 */
const VmTable = ({
  isLoading = null,
  isError = false,
  isSuccess,
  columns = [],
  vms = [],
  setSelectedVms,
}) => {
  const navigate = useNavigate();

  const handleNameClick = (id) => {
    console.log("VmTable > handleNameClick ...");
    navigate(`/computing/vms/${id}`);
  };
  const handleRowSelection = (selectedRows) => {
    console.log("VmTable > handleRowSelection ...");
    setSelectedVms(selectedRows);
  };

  console.log("...");
  return (
    <>
      {/* 테이블 */}
      <TablesOuter
        isLoading={isLoading}
        isError={isError}
        isSuccess={isSuccess}
        columns={columns}
        data={vms.map((vm) => ({
          ...vm,
          icon: renderVmStatusIcon(vm.status),
          host: vm.hostVo?.id ? (
            <TableRowClick type="host" id={vm.hostVo.id}>
              {vm.hostVo.name}
            </TableRowClick>
          ) : (
            ""
          ),
          cluster: vm.clusterVo?.id ? (
            <TableRowClick type="cluster" id={vm.clusterVo.id}>
              {vm.clusterVo.name}
            </TableRowClick>
          ) : (
            ""
          ),
          dataCenter: vm.dataCenterVo?.id ? (
            <TableRowClick type="datacenter" id={vm.dataCenterVo.id}>
              {vm.dataCenterVo.name}
            </TableRowClick>
          ) : (
            ""
          ),
          ipv4: vm.ipv4 + " " + vm.ipv6,
          memoryUsage:
            vm.usageDto?.memoryPercent === null ||
            vm.usageDto?.memoryPercent === undefined
              ? ""
              : `${vm.usageDto.memoryPercent}%`,
          cpuUsage:
            vm.usageDto?.cpuPercent === null ||
            vm.usageDto?.cpuPercent === undefined
              ? ""
              : `${vm.usageDto.cpuPercent}%`,
          networkUsage:
            vm.usageDto?.networkPercent === null ||
            vm.usageDto?.networkPercent === undefined
              ? ""
              : `${vm.usageDto.networkPercent}%`,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={handleRowSelection}
        clickableColumnIndex={[1]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
      />
    </>
  );
};

export default VmTable;
