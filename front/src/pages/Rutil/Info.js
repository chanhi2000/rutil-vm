import logo from '../../assets/images/logo.png'
import { 
  useDashboard, 
  useDashboardCpuMemory, 
  useDashboardStorage,
} from '../../api/RQHook';

const Info = () => {
  const { data: dashboard = [] } = useDashboard();
  const { data: cpuMemory = [] } = useDashboardCpuMemory();
  const { data: storage = [] } = useDashboardStorage();
  
  return (
    <div className="rutil-general">
      <div className="rutil-general-first-contents">
        <div>
          <img className="logo-general" src={logo} alt="logo" />
          <span>
            버전: {dashboard?.version}<br />
            빌드날짜: {dashboard?.releaseDate}
          </span>
        </div>
        <div>
          <div>
            <span>데이터센터: {dashboard?.datacenters ?? 0}</span><br/>
            <span>클러스터: {dashboard?.clusters ?? 0}</span><br/>
            <span>호스트: {dashboard?.hosts ?? 0}</span><br/>
            <span>가상머신: {dashboard?.vmsUp ?? 0} / {dashboard?.vms}</span><br/>
            <span>스토리지 도메인: {dashboard?.storageDomains ?? 0}</span><br/>
          </div>
          <br/>
          <div>부팅시간(업타임): <strong>{dashboard?.bootTime ?? ""}</strong></div>
        </div>
      </div>
      <div className="type-info-boxs">
        <div className="type-info-box">CPU: {Math.floor(100 - (cpuMemory?.totalCpuUsagePercent ?? 0))}% 사용가능</div>
        <div className="type-info-box">메모리: {Math.floor(100 - (cpuMemory?.totalMemoryUsagePercent ?? 0))}% 사용가능</div>
        <div className="type-info-box">스토리지: {Math.floor(100 - (storage?.usedPercent ?? 0))}% 사용가능</div>
      </div>
    </div>
  )
}

export default Info