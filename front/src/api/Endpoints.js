const ENDPOINT_API_V1 = `/api/v1`
const ENDPOINTS = {
  //#region: TreeNavigation
  FIND_ALL_TREE_NAVIGATIONS: (type) =>                                     `${ENDPOINT_API_V1}/navigation/${type}`,
  //#endregion: TreeNavigation

  //#region: Dashboard
  GET_DASHBOARD: () =>                                                     `${ENDPOINT_API_V1}/dashboard`,
  GET_CPU_MEMORY: () =>                                                    `${ENDPOINT_API_V1}/dashboard/cpumemory`,
  GET_STORAGE: () =>                                                       `${ENDPOINT_API_V1}/dashboard/storage`,
  GET_VM_CPU: () =>                                                        `${ENDPOINT_API_V1}/dashboard/vmCpu`,
  GET_VM_MEMORY: () =>                                                     `${ENDPOINT_API_V1}/dashboard/vmMemory`,
  GET_STORAGE_MEMORY: () =>                                                `${ENDPOINT_API_V1}/dashboard/storageMemory`,

  GET_PER_VM_CPU: () =>                                                    `${ENDPOINT_API_V1}/dashboard/vmCpuPerList`,
  GET_PER_VM_MEMORY: () =>                                                 `${ENDPOINT_API_V1}/dashboard/vmMemoryPerList`,
  GET_PER_VM_NETWORK: () =>                                                `${ENDPOINT_API_V1}/dashboard/vmNetworkPerList`,
         
  GET_METRIC_VM: () =>                                                     `${ENDPOINT_API_V1}/dashboard/vmMetricList`,
  GET_METRIC_STORAGE: () =>                                                `${ENDPOINT_API_V1}/dashboard/storageMetricList`,
  //#endregion: Dashboard
  
  //#region: DataCenter
  FIND_ALL_DATA_CENTERS: () =>                                             `${ENDPOINT_API_V1}/computing/datacenters`,
  FIND_DATA_CENTER: (dataCenterId) =>                                      `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}`, 
  FIND_CLUSTERS_FROM_DATA_CENTER: (dataCenterId) =>                        `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/clusters`, 
  FIND_HOSTS_FROM_DATA_CENTER: (dataCenterId) =>                           `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/hosts`, 
  FIND_VMS_FROM_DATA_CENTER: (dataCenterId) =>                             `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/vms`, 
  FIND_STORAGE_DOMAINS_FROM_DATA_CENTER: (dataCenterId) =>                 `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/storageDomains`, 
  FIND_ACTIVE_STORAGE_DOMAINS_FROM_DATA_CENTER: (dataCenterId) =>          `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/activeDomains`,
  FIND_NETWORKS_FROM_DATA_CENTER: (dataCenterId) =>                        `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/networks`, 
  FIND_EVENTS_FROM_DATA_CENTER: (dataCenterId) =>                          `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/events`,
  FIND_TEMPLATES_FROM_DATA_CENTER: (dataCenterId) =>                       `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/templates`,
  FIND_ATTACH_DISK_LIST_FROM_DATA_CENTER:(dataCenterId) =>                 `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/attachDisks`,
  FIND_ISOS_FROM_DATA_CENTER:(dataCenterId) =>                             `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/iso`, 
  FIND_VNICPROFILES_FROM_DATA_CENTER:(dataCenterId) =>                     `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/vnicProfiles`, 

  ADD_DATA_CENTER: () =>                                                   `${ENDPOINT_API_V1}/computing/datacenters`,
  EDIT_DATA_CENTER: (dataCenterId) =>                                      `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}`, 
  DELETE_DATA_CENTER: (dataCenterId) =>                                    `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}`, 
  //#endregion: DataCenter

  // region: Cluster
  FIND_ALL_CLUSTERS: () =>                                                 `${ENDPOINT_API_V1}/computing/clusters`,
  FIND_ALL_UP_CLUSTERS: () =>                                              `${ENDPOINT_API_V1}/computing/clusters/up`,
  FIND_CLUSTER: (clusterId) =>                                             `${ENDPOINT_API_V1}/computing/clusters/${clusterId}`, 
  FIND_HOSTS_FROM_CLUSTER:(clusterId) =>                                   `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/hosts`, 
  FIND_VMS_FROM_CLUSTER:(clusterId) =>                                     `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/vms`, 

  FIND_NETWORKS_FROM_CLUSTER:(clusterId) =>                                `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/networks`, 
  ADD_NETWORK_FROM_CLUSTER:(clusterId) =>                                  `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/networks`,
  MANAGE_NETWORKS_FROM_CLUSTER:(clusterId) =>                              `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/manageNetworks`, 
  FIND_OS_SYSTEM_FROM_CLUSTER:(clusterId) =>                               `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/osSystems`, 

  FIND_EVENTS_FROM_CLUSTER: (clusterId) =>                                 `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/events`,
  FIND_CPU_PROFILES_FROM_CLUSTER:(clusterId) =>                            `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/cpuProfiles`, 
    
  ADD_CLUSTER: () =>                                                       `${ENDPOINT_API_V1}/computing/clusters`,
  EDIT_CLUSTER: (clusterId) =>                                             `${ENDPOINT_API_V1}/computing/clusters/${clusterId}`, 
  DELETE_CLUSTER: (clusterId) =>                                           `${ENDPOINT_API_V1}/computing/clusters/${clusterId}`, 
  // endregion: Cluster

  //#region: Host
  FIND_ALL_HOSTS: () =>                                                    `${ENDPOINT_API_V1}/computing/hosts`,
  FIND_HOST: (hostId) =>                                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}`, 
  FIND_VMS_FROM_HOST:(hostId) =>                                           `${ENDPOINT_API_V1}/computing/hosts/${hostId}/vms`, 

  FIND_HOST_NICS_FROM_HOST: (hostId) =>                                    `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics`, 
  FIND_NETWORKS_FROM_HOST: (hostId) =>                                     `${ENDPOINT_API_V1}/computing/hosts/${hostId}/network`, 
  SETUP_HOST_NICS_FROM_HOST: (hostId) =>                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics/setup`, 

  FIND_HOSTDEVICES_FROM_HOST:(hostId) =>                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}/devices`, 
  FIND_EVENTS_FROM_HOST:(hostId) =>                                        `${ENDPOINT_API_V1}/computing/hosts/${hostId}/events`, 

  FIND_FIBRES_FROM_HOST: (hostId) =>                                       `${ENDPOINT_API_V1}/computing/hosts/${hostId}/fibres`,
  FIND_ISCSIS_FROM_HOST: (hostId) =>                                       `${ENDPOINT_API_V1}/computing/hosts/${hostId}/iscsis`,
  FIND_IMPORT_ISCSIS_FROM_HOST: (hostId) =>                                `${ENDPOINT_API_V1}/computing/hosts/${hostId}/iscsisToImport`,
  FIND_IMPORT_FCPS_FROM_HOST: (hostId) =>                                  `${ENDPOINT_API_V1}/computing/hosts/${hostId}/fcpToImport`,
  FIND_LOGIN_ISCSIS_FROM_HOST: (hostId) =>                                 `${ENDPOINT_API_V1}/computing/hosts/${hostId}/iscsiToLogin`,

  ADD_HOST: (deploy_hosted_engine) =>                                      `${ENDPOINT_API_V1}/computing/hosts?deploy_hosted_engine=${deploy_hosted_engine}`,
  EDIT_HOST: (hostId) =>                                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}`, 
  DELETE_HOST: (hostId) =>                                                 `${ENDPOINT_API_V1}/computing/hosts/${hostId}`, 
  ACTIVATE_HOST: (hostId) =>                                               `${ENDPOINT_API_V1}/computing/hosts/${hostId}/activate`, 
  DEACTIVATE_HOST: (hostId) =>                                             `${ENDPOINT_API_V1}/computing/hosts/${hostId}/deactivate`, 
  RESTART_HOST: (hostId) =>                                                `${ENDPOINT_API_V1}/computing/hosts/${hostId}/restart`, 
  //#endregion: Host

  //#region: Vm
  FIND_ALL_VMS: () =>                                                      `${ENDPOINT_API_V1}/computing/vms`,
  FIND_VM: (vmId) =>                                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}`, 
  FIND_EDIT_VM: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/vms/${vmId}/edit`, 
  
  FIND_DISKS_FROM_VM: (vmId) =>                                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks`, 
  FIND_DISK_FROM_VM: (vmId, diskAttachmentId) =>                           `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}`,
  ADD_DISK_FROM_VM: (vmId) =>                                              `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks`, 
  EDIT_DISK_FROM_VM: (vmId, diskAttachmentId) =>                           `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}`,
  DELETE_DISK_FROM_VM:(vmId, diskAttachmentId, detachOnly) =>              `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}?detachOnly=${detachOnly}`,
  DELETE_DISKS_FROM_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks`, 
  ATTACH_DISK_FROM_VM: (vmId) =>                                           `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/attach`, 
  ATTACH_DISKS_FROM_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/attachs`, 
  FIND_STORAGE_DOMAINS_FROM_VM: (vmId, diskAttachmentId) =>                `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}/storageDomains`,
  ACTIVATE_DISK_FROM_VM: (vmId, diskAttachmentId) =>                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}/activate`, 
  DEACTIVATE_DISK_FROM_VM: (vmId, diskAttachmentId) =>                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}/deactivate`, 
  MOVE_DISK_FROM_VM: (vmId) =>                                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/move`, 

  FIND_SNAPSHOTS_FROM_VM: (vmId) =>                                        `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots`, 
  FIND_SNAPSHOT_FROM_VM: (vmId, snapshotId) =>                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/${snapshotId}`, 
  ADD_SNAPSHOT_FROM_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots`, 
  DELETE_SNAPSHOTS_FROM_VM: (vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots`, // 스냅샷 여러개
  DELETE_SNAPSHOT_FROM_VM: (vmId,snapshotId) =>                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/${snapshotId}`, 
  PREVIEW_SNAPSHOT_FROM_VM: (vmId, snapshotId) =>                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/${snapshotId}/preview`,
  CLONE_SNAPSHOTS_FROM_VM: (vmId) =>                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/clone`, 
  COMMIT_SNAPSHOTS_FROM_VM: (vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/commit`, 
  UNDO_SNAPSHOTS_FROM_VM: (vmId) =>                                        `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/undo`, 

  FIND_NICS_FROM_VM: (vmId) =>                                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics`, 
  FIND_NIC_FROM_VM: (vmId, nicId) =>                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}`, 
  ADD_NICS_FROM_VM: (vmId) =>                                              `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics`, 
  EDIT_NIC_FROM_VM: (vmId, nicId) =>                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}`, 
  DELETE_NIC_FROM_VM: (vmId, nicId) =>                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}`, 

  FIND_APPLICATIONS_FROM_VM:(vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/applications`, 
  FIND_HOST_DEVICES_FROM_VM:(vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/hostDevices`, 
  FIND_EVENTS_FROM_VM:(vmId) =>                                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/events`, 

  ADD_VM: () =>                                                            `${ENDPOINT_API_V1}/computing/vms`,
  EDIT_VM: (vmId) =>                                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}`, 
  DELETE_VM: (vmId, detachOnly) =>                                         `${ENDPOINT_API_V1}/computing/vms/${vmId}?detachOnly=${detachOnly}`,
  
  START_VM: (vmId) =>                                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/start`, 
  PAUSE_VM: (vmId) =>                                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/pause`, 
  POWER_OFF_VM: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/vms/${vmId}/powerOff`, 
  SHUT_DOWN_VM: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/vms/${vmId}/shutdown`, 
  REBOOT_VM: (vmId) =>                                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/reboot`, 
  RESET_VM: (vmId) =>                                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/reset`, 
  EXPORT_VM: (vmId) =>                                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/export`, 
  CONSOLE_VM: (vmId) =>                                                    `${ENDPOINT_API_V1}/computing/vms/${vmId}/console`, 
  MIGRATE_HOST_LIST_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/migrateHosts`, 
  MIGRATE_VM: (vmId, hostId) =>                                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/migrate/${hostId}`, 
  //#endregion: Vm

  //#region: Template
  FIND_ALL_TEMPLATES :() =>                                                `${ENDPOINT_API_V1}/computing/templates`,
  FIND_TEMPLATE: (templateId) =>                                           `${ENDPOINT_API_V1}/computing/templates/${templateId}`, 
  FIND_VMS_FROM_TEMPLATE: (templateId) =>                                  `${ENDPOINT_API_V1}/computing/templates/${templateId}/vms`, 
  FIND_NICS_FROM_TEMPLATE: (templateId) =>                                 `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics`, 
  ADD_NICS_FROM_TEMPLATE: (templateId) =>                                  `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics`, 
  EDIT_NICS_FROM_TEMPLATE: (templateId, nicId) =>                          `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics/${nicId}`,
  DELETE_NICS_FROM_TEMPLATE: (templateId, nicId) =>                        `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics/${nicId}`,
  FIND_DISKS_FROM_TEMPLATE: (templateId) =>                                `${ENDPOINT_API_V1}/computing/templates/${templateId}/disks`,  
  FIND_STORAGE_DOMAINS_FROM_TEMPLATE: (templateId) =>                      `${ENDPOINT_API_V1}/computing/templates/${templateId}/storageDomains`, 
  FIND_EVENTS_FROM_TEMPLATE: (templateId) =>                               `${ENDPOINT_API_V1}/computing/templates/${templateId}/events`, 

  ADD_TEMPLATE: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/templates/${vmId}`, 
  EDIT_TEMPLATE: (templateId) =>                                           `${ENDPOINT_API_V1}/computing/templates/${templateId}`, 
  DELETE_TEMPLATE: (templateId) =>                                         `${ENDPOINT_API_V1}/computing/templates/${templateId}`, 
  //#endregion: Template

  //#region: Network
  FIND_ALL_NETWORKS: () =>                                                 `${ENDPOINT_API_V1}/networks`,
  FIND_NETWORK: (networkId) =>                                             `${ENDPOINT_API_V1}/networks/${networkId}`,

  FIND_CLUSTERS_FROM_NETWORK:(networkId) =>                                `${ENDPOINT_API_V1}/networks/${networkId}/clusters`,
  FIND_CONNECTED_HOSTS_FROM_NETWORK:(networkId) =>                         `${ENDPOINT_API_V1}/networks/${networkId}/connectedHosts`,
  FIND_DISCONNECTED_HOSTS_FROM_NETWORK:(networkId) =>                      `${ENDPOINT_API_V1}/networks/${networkId}/disconnectedHosts`,
  FIND_VMS_FROM_NETWORK:(networkId) =>                                     `${ENDPOINT_API_V1}/networks/${networkId}/vms`,
  FIND_TEMPLATES_NETWORK:(networkId) =>                                    `${ENDPOINT_API_V1}/networks/${networkId}/templates`,

  ADD_NETWORK: () =>                                                       `${ENDPOINT_API_V1}/networks`,
  EDIT_NETWORK: (networkId) =>                                             `${ENDPOINT_API_V1}/networks/${networkId}`,
  DELETE_NETWORK: (networkId) =>                                           `${ENDPOINT_API_V1}/networks/${networkId}`,
  FIND_NETWORK_PROVIDERS: () =>                                            `${ENDPOINT_API_V1}/networks/import/settings`,
  FIND_NETWORKS_FROM_PROVIDERS: (providerId) =>                            `${ENDPOINT_API_V1}/networks/import/settings/${providerId}`,
  FIND_DATA_CENTERS_FROM_NETWORK: (openstackNetworkId) =>                  `${ENDPOINT_API_V1}/networks/import/datacenters/${openstackNetworkId}`,
  IMPORT_NETWORK: () =>                                                    `${ENDPOINT_API_V1}/networks/import`,
  
  FIND_VNIC_PROFILES_FROM_NETWORK: (networkId) =>                          `${ENDPOINT_API_V1}/networks/${networkId}/vnicProfiles`,
  FIND_ALL_NETWORKFILTERS: () =>                                           `${ENDPOINT_API_V1}/networks/networkFilters`,
  //#endregion: Network

  //#region: VnicProfile
  FIND_ALL_VNIC_PROFILES: () =>                                            `${ENDPOINT_API_V1}/vnicProfiles`,
  FIND_VNIC_PROFILE: (vnicProfileId) =>                                    `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}`,
  FIND_VMS_VNIC_PROFILE: (vnicProfileId) =>                                `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}/vms`,
  FIND_TEMPLATE_VNIC_PROFILE: (vnicProfileId) =>                           `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}/templates`,
  ADD_VNIC_PROFILE_FROM_NETWORK: (networkId) =>                            `${ENDPOINT_API_V1}/vnicProfiles`,
  EDIT_VNIC_PROFILE_FROM_NETWORK: (vnicProfileId) =>                       `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}`,
  DELETE_VNIC_PROFILE_FROM_NETWORK: (vnicProfileId) =>                     `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}`,
  //#endregion: VnicProfile

  //#region: StorageDomain
  FIND_ALL_STORAGE_DOMAINS: () =>                                          `${ENDPOINT_API_V1}/storages/domains`,
  FIND_STORAGE_DOMAIN: (storageDomainId) =>                                `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}`,
  
  FIND_DATA_CENTERS_FROM_STORAGE_DOMAINS: (storageDomainId) =>             `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters`,
  FIND_HOSTS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                    `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/hosts`,
  ACTIVATE_FROM_DATACENTER: (storageDomainId, dataCenterId) =>             `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/activate`,
  ATTACH_FROM_DATACENTER: (storageDomainId, dataCenterId) =>               `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/attach`,
  DETACH_FROM_DATACENTER: (storageDomainId, dataCenterId) =>               `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/detach`,
  MAINTENANCE_FROM_DATACENTER: (storageDomainId, dataCenterId) =>          `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/maintenance`,
  
  FIND_VMS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                      `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/vms`,
  FIND_UNREGISTERD_VMS_FROM_STORAGE_DOMAINS: (storageDomainId) =>          `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/vms/unregistered`,
  FIND_DISKS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                    `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks`,
  FIND_UNREGISTERD_DISKS_FROM_STORAGE_DOMAINS: (storageDomainId) =>        `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks/unregistered`,
  REGISTERD_DISK_FROM_STORAGE_DOMAINS: (storageDomainId, diskId) =>        `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks/${diskId}`,
  DELETE_REGISTERD_DISK_FROM_STORAGE_DOMAINS: (storageDomainId, diskId) => `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks/${diskId}`,
  FIND_TEMPLATES_FROM_STORAGE_DOMAINS: (storageDomainId) =>                `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/templates`,
  FIND_UNREGISTERD_TEMPLATES_FROM_STORAGE_DOMAINS: (storageDomainId) =>    `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/templates/unregistered`,
  FIND_DISK_PROFILES_FROM_STORAGE_DOMAINS: (storageDomainId) =>            `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/diskProfiles`,
  FIND_DISK_SNAPSHOTS_FROM_STORAGE_DOMAINS: (storageDomainId) =>           `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/diskSnapshots`,
  FIND_EVENTS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                   `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/events`,
  FIND_ACTIVE_DATA_CENTERS: () =>                                          `${ENDPOINT_API_V1}/storages/domains/dataCenters`,
  
  
  ADD_STORAGE_DOMAIN: () =>                                                `${ENDPOINT_API_V1}/storages/domains`,
  IMPORT_STORAGE_DOMAIN: () =>                                             `${ENDPOINT_API_V1}/storages/domains/import`,
  EDIT_STORAGE_DOMAIN: (domainId) =>                                       `${ENDPOINT_API_V1}/storages/domains/${domainId}`,
  // DELETE_STORAGE_DOMAIN: (domainId, format, hostName) =>                `${ENDPOINT_API_V1}/storages/domains/${domainId}?format=${format}&host=${hostName}`,
  DELETE_STORAGE_DOMAIN: (domainId, format, hostName) => {
    let url = `/api/v1/storages/domains/${domainId}`;
    if (format) {
      url += `?format=true&host=${hostName}`;
    } else {
      url += `?host=${hostName}`;
    }
    console.log('Generated URL:', url); // URL 확인
    return url;
  },  
  DESTORY_STORAGE_DOMAIN: (storageDomainId) =>                             `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/destroy`, 
  OVF_UPDATE_STORAGE_DOMAIN: (storageDomainId) =>                          `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/updateOvf`,
  REFRESH_LUN_STORAGE_DOMAIN: (storageDomainId) =>                         `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/refreshLun`,

  //#endregion: StorageDomain

  //#region: Disk
  FIND_ALL_DISKS: () =>                                                    `${ENDPOINT_API_V1}/storages/disks`,
  FIND_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}`,
  FIND_VMS_FROM_DISK: (diskId) =>                                          `${ENDPOINT_API_V1}/storages/disks/${diskId}/vms`,
  FIND_STORAGE_DOMAINS_FROM_DISK: (diskId) =>                              `${ENDPOINT_API_V1}/storages/disks/${diskId}/storageDomains`,

  ADD_DISK: () =>                                                          `${ENDPOINT_API_V1}/storages/disks`,
  EDIT_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}`,
  DELETE_DISK: (diskId) =>                                                 `${ENDPOINT_API_V1}/storages/disks/${diskId}`,
  COPY_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}/copy`,
  FIND_STORAGE_DOMAINS_TO_MOVE_DISK: (diskId) =>                           `${ENDPOINT_API_V1}/storages/disks/${diskId}/move`,
  MOVE_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}/move`,
  REFRESH_LUN_DISK: (diskId) =>                                            `${ENDPOINT_API_V1}/storages/disks/${diskId}/refreshLun`,
  UPLOAD_DISK: () =>                                                       `${ENDPOINT_API_V1}/storages/disks/upload`,
  //#endregion: Disk
  
  //#region: Event
  FIND_ALL_EVENTS: () =>                                                   `${ENDPOINT_API_V1}/events`,
  //#endregion: Event
  
  //#region: User
  FIND_ALL_USERS: () =>                                                    `${ENDPOINT_API_V1}/auth/users`,
  FIND_USER: (username) =>                                                 `${ENDPOINT_API_V1}/auth/users/${username}`,
  CHANGE_PASSWORD_USER: (username, currentPassword, newPassword) =>        `${ENDPOINT_API_V1}/auth/users/${username}/changePassword?currentPassword=${currentPassword}&newPassword=${newPassword}`,
  //#endregion: User
  
  //#region: UserSession
  FIND_ALL_USER_SESSIONS: (username) =>                                    `${ENDPOINT_API_V1}/auth/user-sessions?username=${username}`,
  //#endregion: UserSession

  //#region: Certificates
  FIND_ALL_CERTS: () =>                                                    `${ENDPOINT_API_V1}/admin/certs`,
  FIND_CERT: (id) =>                                                       `${ENDPOINT_API_V1}/admin/certs/{id}`
  //#endregion: Certificates
}

export default ENDPOINTS