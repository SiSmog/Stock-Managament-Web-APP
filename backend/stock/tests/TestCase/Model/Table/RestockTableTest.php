<?php
declare(strict_types=1);

namespace App\Test\TestCase\Model\Table;

use App\Model\Table\RestockTable;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\RestockTable Test Case
 */
class RestockTableTest extends TestCase
{
    /**
     * Test subject
     *
     * @var \App\Model\Table\RestockTable
     */
    protected $Restock;

    /**
     * Fixtures
     *
     * @var array<string>
     */
    protected $fixtures = [
        'app.Restock',
    ];

    /**
     * setUp method
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $config = $this->getTableLocator()->exists('Restock') ? [] : ['className' => RestockTable::class];
        $this->Restock = $this->getTableLocator()->get('Restock', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    protected function tearDown(): void
    {
        unset($this->Restock);

        parent::tearDown();
    }
}
