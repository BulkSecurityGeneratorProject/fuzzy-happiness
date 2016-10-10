package fr.miage.bibaldenis.web.rest;

import fr.miage.bibaldenis.BibalDenisApp;

import fr.miage.bibaldenis.domain.Magazine;
import fr.miage.bibaldenis.repository.MagazineRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MagazineResource REST controller.
 *
 * @see MagazineResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BibalDenisApp.class)
public class MagazineResourceIntTest {


    private static final Integer DEFAULT_NUMERO = 1;
    private static final Integer UPDATED_NUMERO = 2;

    private static final LocalDate DEFAULT_PARUTION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PARUTION = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_PERIODICITE = 1;
    private static final Integer UPDATED_PERIODICITE = 2;

    private static final Integer DEFAULT_NB_RESA = 1;
    private static final Integer UPDATED_NB_RESA = 2;

    private static final LocalDate DEFAULT_DATE_AJOUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_AJOUT = LocalDate.now(ZoneId.systemDefault());

    @Inject
    private MagazineRepository magazineRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Inject
    private EntityManager em;

    private MockMvc restMagazineMockMvc;

    private Magazine magazine;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        MagazineResource magazineResource = new MagazineResource();
        ReflectionTestUtils.setField(magazineResource, "magazineRepository", magazineRepository);
        this.restMagazineMockMvc = MockMvcBuilders.standaloneSetup(magazineResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Magazine createEntity(EntityManager em) {
        Magazine magazine = new Magazine()
                .numero(DEFAULT_NUMERO)
                .parution(DEFAULT_PARUTION)
                .periodicite(DEFAULT_PERIODICITE)
                .nbResa(DEFAULT_NB_RESA)
                .dateAjout(DEFAULT_DATE_AJOUT);
        return magazine;
    }

    @Before
    public void initTest() {
        magazine = createEntity(em);
    }

    @Test
    @Transactional
    public void createMagazine() throws Exception {
        int databaseSizeBeforeCreate = magazineRepository.findAll().size();

        // Create the Magazine

        restMagazineMockMvc.perform(post("/api/magazines")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(magazine)))
                .andExpect(status().isCreated());

        // Validate the Magazine in the database
        List<Magazine> magazines = magazineRepository.findAll();
        assertThat(magazines).hasSize(databaseSizeBeforeCreate + 1);
        Magazine testMagazine = magazines.get(magazines.size() - 1);
        assertThat(testMagazine.getNumero()).isEqualTo(DEFAULT_NUMERO);
        assertThat(testMagazine.getParution()).isEqualTo(DEFAULT_PARUTION);
        assertThat(testMagazine.getPeriodicite()).isEqualTo(DEFAULT_PERIODICITE);
        assertThat(testMagazine.getNbResa()).isEqualTo(DEFAULT_NB_RESA);
        assertThat(testMagazine.getDateAjout()).isEqualTo(DEFAULT_DATE_AJOUT);
    }

    @Test
    @Transactional
    public void getAllMagazines() throws Exception {
        // Initialize the database
        magazineRepository.saveAndFlush(magazine);

        // Get all the magazines
        restMagazineMockMvc.perform(get("/api/magazines?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(magazine.getId().intValue())))
                .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)))
                .andExpect(jsonPath("$.[*].parution").value(hasItem(DEFAULT_PARUTION.toString())))
                .andExpect(jsonPath("$.[*].periodicite").value(hasItem(DEFAULT_PERIODICITE)))
                .andExpect(jsonPath("$.[*].nbResa").value(hasItem(DEFAULT_NB_RESA)))
                .andExpect(jsonPath("$.[*].dateAjout").value(hasItem(DEFAULT_DATE_AJOUT.toString())));
    }

    @Test
    @Transactional
    public void getMagazine() throws Exception {
        // Initialize the database
        magazineRepository.saveAndFlush(magazine);

        // Get the magazine
        restMagazineMockMvc.perform(get("/api/magazines/{id}", magazine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(magazine.getId().intValue()))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO))
            .andExpect(jsonPath("$.parution").value(DEFAULT_PARUTION.toString()))
            .andExpect(jsonPath("$.periodicite").value(DEFAULT_PERIODICITE))
            .andExpect(jsonPath("$.nbResa").value(DEFAULT_NB_RESA))
            .andExpect(jsonPath("$.dateAjout").value(DEFAULT_DATE_AJOUT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMagazine() throws Exception {
        // Get the magazine
        restMagazineMockMvc.perform(get("/api/magazines/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMagazine() throws Exception {
        // Initialize the database
        magazineRepository.saveAndFlush(magazine);
        int databaseSizeBeforeUpdate = magazineRepository.findAll().size();

        // Update the magazine
        Magazine updatedMagazine = magazineRepository.findOne(magazine.getId());
        updatedMagazine
                .numero(UPDATED_NUMERO)
                .parution(UPDATED_PARUTION)
                .periodicite(UPDATED_PERIODICITE)
                .nbResa(UPDATED_NB_RESA)
                .dateAjout(UPDATED_DATE_AJOUT);

        restMagazineMockMvc.perform(put("/api/magazines")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedMagazine)))
                .andExpect(status().isOk());

        // Validate the Magazine in the database
        List<Magazine> magazines = magazineRepository.findAll();
        assertThat(magazines).hasSize(databaseSizeBeforeUpdate);
        Magazine testMagazine = magazines.get(magazines.size() - 1);
        assertThat(testMagazine.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testMagazine.getParution()).isEqualTo(UPDATED_PARUTION);
        assertThat(testMagazine.getPeriodicite()).isEqualTo(UPDATED_PERIODICITE);
        assertThat(testMagazine.getNbResa()).isEqualTo(UPDATED_NB_RESA);
        assertThat(testMagazine.getDateAjout()).isEqualTo(UPDATED_DATE_AJOUT);
    }

    @Test
    @Transactional
    public void deleteMagazine() throws Exception {
        // Initialize the database
        magazineRepository.saveAndFlush(magazine);
        int databaseSizeBeforeDelete = magazineRepository.findAll().size();

        // Get the magazine
        restMagazineMockMvc.perform(delete("/api/magazines/{id}", magazine.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Magazine> magazines = magazineRepository.findAll();
        assertThat(magazines).hasSize(databaseSizeBeforeDelete - 1);
    }
}
