<?php
declare(strict_types=1);

namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ArticleTable;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ArticleTable Test Case
 */
class ArticleTableTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \App\Model\Table\ArticleTable
     */
    protected $Article;

    /**
     * Fixtures
     *
     * @var array<string>
     */
    protected $fixtures = [
        'app.Article',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $config = $this->getTableLocator()->exists('Article') ? [] : ['className' => ArticleTable::class];
        $this->Article = $this->getTableLocator()->get('Article', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    protected function tearDown(): void
    {
        unset($this->Article);

        parent::tearDown();
    }
}
