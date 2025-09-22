package com.ultex.crm.service;

import com.ultex.crm.domain.Prospect;
import com.ultex.crm.repository.ProspectRepository;
import com.ultex.crm.service.dto.ProspectDTO;
import com.ultex.crm.service.mapper.ProspectMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ultex.crm.domain.Prospect}.
 */
@Service
@Transactional
public class ProspectService {

    private static final Logger LOG = LoggerFactory.getLogger(ProspectService.class);

    private final ProspectRepository prospectRepository;

    private final ProspectMapper prospectMapper;

    public ProspectService(ProspectRepository prospectRepository, ProspectMapper prospectMapper) {
        this.prospectRepository = prospectRepository;
        this.prospectMapper = prospectMapper;
    }

    /**
     * Save a prospect.
     *
     * @param prospectDTO the entity to save.
     * @return the persisted entity.
     */
    public ProspectDTO save(ProspectDTO prospectDTO) {
        LOG.debug("Request to save Prospect : {}", prospectDTO);
        Prospect prospect = prospectMapper.toEntity(prospectDTO);
        prospect = prospectRepository.save(prospect);
        return prospectMapper.toDto(prospect);
    }

    /**
     * Update a prospect.
     *
     * @param prospectDTO the entity to save.
     * @return the persisted entity.
     */
    public ProspectDTO update(ProspectDTO prospectDTO) {
        LOG.debug("Request to update Prospect : {}", prospectDTO);
        Prospect prospect = prospectMapper.toEntity(prospectDTO);
        prospect = prospectRepository.save(prospect);
        return prospectMapper.toDto(prospect);
    }

    /**
     * Partially update a prospect.
     *
     * @param prospectDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProspectDTO> partialUpdate(ProspectDTO prospectDTO) {
        LOG.debug("Request to partially update Prospect : {}", prospectDTO);

        return prospectRepository
            .findById(prospectDTO.getId())
            .map(existingProspect -> {
                prospectMapper.partialUpdate(existingProspect, prospectDTO);

                return existingProspect;
            })
            .map(prospectRepository::save)
            .map(prospectMapper::toDto);
    }

    /**
     * Get all the prospects.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ProspectDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Prospects");
        return prospectRepository.findAll(pageable).map(prospectMapper::toDto);
    }

    /**
     * Get one prospect by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProspectDTO> findOne(Long id) {
        LOG.debug("Request to get Prospect : {}", id);
        return prospectRepository.findById(id).map(prospectMapper::toDto);
    }

    /**
     * Delete the prospect by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Prospect : {}", id);
        prospectRepository.deleteById(id);
    }
}
