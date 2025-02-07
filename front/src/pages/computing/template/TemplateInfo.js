import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import NavButton from '../../../components/navigation/NavButton';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import { useTemplate } from '../../../api/RQHook';
import Path from '../../../components/Header/Path';
import TemplateGeneral from './TemplateGeneral';
import TemplateVms from './TemplateVms';
import TemplateEvents from './TemplateEvents';
import TemplateNics from './TemplateNics';
import TemplateDisks from './TemplateDisks';
import TemplateStorage from './TemplateStorage';
import TemplateModals from './modal/TemplateModals';

const TemplateInfo = () => {
  const navigate = useNavigate();
  const { id: templateId, section } = useParams();
  const {
    data: template, isError, isLoading
  } = useTemplate(templateId);

  const [activeTab, setActiveTab] = useState('general');
  const [activeModal, setActiveModal] = useState(null);
  
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !template)) {
      navigate('/computing/templates');
    }
  }, [isError, isLoading, template, navigate]);

  const sections = [
    { id: 'general', label: '일반' },
    { id: 'vms', label: '가상머신' },
    { id: 'nics', label: '네트워크 인터페이스' },
    { id: 'disks', label: '디스크' },
    { id: 'storageDomains', label: '스토리지' },
    { id: 'events', label: '이벤트' },
  ];

  useEffect(() => {
    setActiveTab(section || 'general');
  }, [section]);
  
  const handleTabClick = (tab) => {
    const path = tab === 'general' ? `/computing/templates/${templateId}` : `/computing/templates/${templateId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [template?.name, sections.find((section) => section.id === activeTab)?.label];

  const renderSectionContent = () => {
    const SectionComponent = {
      general: TemplateGeneral,
      vms: TemplateVms,
      nics: TemplateNics,
      disks: TemplateDisks,
      storageDomains: TemplateStorage,
      events: TemplateEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent templateId={templateId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: 'edit', label: '편집', onClick: () => openModal('edit') },
    { type: 'delete', label: '삭제', onClick: () => openModal('delete') },
    { type: 'addVm', label: '새 가상머신', onClick: () => openModal('addVm') },
  ];

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faDesktop}
        title={template?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="host-btn-outer">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>

      {/* template 모달창 */}
      <TemplateModals
        activeModal={activeModal}
        template={template}
        selectedTemplates={template}
        onClose={closeModal}
      />
      <Footer />
    </div>
  );
};

export default TemplateInfo;
